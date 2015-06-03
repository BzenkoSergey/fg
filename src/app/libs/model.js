function createModel() {
	function ModelBuilder() {
		var params = {
				classProps: {
					// flag for Model constructor
					isModel: true,
	
					extendProto: extendModelProto,
					extendClass: extendModelClass
				},
	
				// values that gens dynamically
				computeClass: {},
		
				// constructor prototype props
				protoProps: {},
		
				// values that gens dynamically
				computeProto: {}
			},
	
			utils = {
				extend: extend
			},
	
			components = {};
		
		this.component = function addComponent(component) {
			var componentParams = component();
			components[componentParams.name] = componentParams;
			var componentUtils = {};
			if(componentParams.utils) {
				componentUtils = componentParams.utils.apply(this, [components, params, utils]);
			}
			componentParams.utils = componentUtils;
			componentParams.run.apply(this, [components, params, utils]);
			return this;
		};
	
		this.extendInit = function extendInit(cb, isBefore) {
			var props = params.protoProps,
				init = props.init;
	
			if(!init) {
				props.init = cb;
				return this;
			}
			props.init = function() {
				if(isBefore) {
					cb.apply(this, arguments);
					return init.apply(this);
				}
				init.apply(this);
				return cb.apply(this, arguments);
			};
			return this;
		};
	
		this.extendProto = function extendProto(obj, isCompute) {
			var paramName = isCompute ? 'computeProto' : 'protoProps';
			extend(params[paramName], obj);
			return this;
		};
	
		this.extendClass = function extendClass(obj, isCompute) {
			var paramName = isCompute ? 'computeClass' : 'classProps';
			extend(params[paramName], obj);
			return this;
		};
	
	
		function extend(obj, source, isComputeMode) {
			var name;
	
			if(isComputeMode) {
				for(name in source) {
					var result = source[name].apply(this, [obj]);
					if(result === undefined) {
						continue;
					}
					obj[name] = result;
				}
				return obj;
			}
	
			for(name in source) {
				var prop = source[name];
				if(prop === undefined) {
					continue;
				}
				obj[name] = prop;
			}
			return obj;
		}
	
		function extendModelProto(custom, isComputeMode) {
			var subProto = this.private('_sys').subProto,
		
				// support inheritance of constructors init params
				props = isComputeMode ? subProto.computeProto : subProto.protoProps;
	
			// add new proto props to Model sub prototype
			extend.apply(this, [props, custom]);
	
			extend.apply(this, [this.prototype, custom, isComputeMode]);
			return this;
		}
	
		function extendModelClass(custom, isComputeMode) {
			var subProto = this.private('_sys').subProto,
		
				// support inheritance of constructors init params
				props = isComputeMode ? subProto.computeClass : subProto.classProps;
		
			// add new props to Model sub prototype
			extend.apply(this, [props, custom]);
		
			// apply new props to this Model
			extend.apply(this, [this, custom, isComputeMode]);
			return this;
		}
	}

	/**
	 * Inheritance way
	 * Model:
	 * 		subProto object contains copy of subProto parent 
	 * 		and has some modification for self and their childs
	 * 
	 * 		ex: var SubModel = Model.extend();
	 * 			SubModel.extendClass({
	 * 				getSelf: function() { return this; }
	 * 			});
	 * 
	 * 			SubModel.getSelf() === SubModel
	 * 
	 * 			var SubSubModel = SubModel.extend();
	 * 			SubSubModel.getSelf() === SubSubModel
	 * 
	 * 		Inits: each Model has inits (before, cbs, after) array for creating instance.
	 * 
	 * Instance:
	 * 		Prototype inheritance.
	 * 		Inits: each instance has inits (before, cbs, after) array for update instance.
	 * 
	 * 		ex: var subSubModel = new SubSubModel();
	 * 			subSubModel.count // undefined
	 * 			subSubModel.addInit(function() {
	 * 				this.count = 0;
	 * 			});
	 * 			subSubModel.count // 0
	 * 			subSubModel.addInit(function() {
	 * 				this.count = 1;
	 * 			});
	 * 			subSubModel.count // 1
	 * 
	 * 			subSubModel.init();
	 * 			subSubModel.count // 1
	 */
	
	var inheritanceComponent = function() {
		var isCreatingChildProcess = false,
			isCreatingBaseProcess = false,
			builderParams,
			utils;
	
		return {
			name: 'inheritance',
			utils: function() {
				return {
					createStorage: createStorage
				};
			},
			run: function(components, modelBuilderParams, modelBuilderUtils) {
				builderParams = modelBuilderParams;
				utils = modelBuilderUtils;
	
				this.extendClass({
					extend: function extend() {
						return createChild.apply(this, arguments);
					}
				});
	
				// add create ability to builder
				this.create = function(baseObject) {
					isCreatingBaseProcess = true;
					var BaseModel = createChild.apply(baseObject || Object);
					isCreatingBaseProcess = false;
					return BaseModel;
				};
			}
		};
	
		function createStorage(forModel) {
			var storage = {};
	
			storage.inits = {
				before: [],
				cbs: [],
				after: []
			};
	
			if(forModel) {
				storage.subProto = {
					classProps: {},
					computeClass: {},
					protoProps: {},
					computeProto: {}
				};
			}
			
			return storage;
		}
	
		function getConstructor() {
			return function ModelClass() {
				if(isCreatingChildProcess) {
					return true;
				}
	
				var result = this.init.apply(this, arguments);
				if(result.status) {
					return true;
				}
	
				console.error({
					model: this.Model,
					result: this,
					failedMethod: result.method,
					arguments: arguments
				});
				throw 'Fail status of initializing Model instance.';
			};
		}
		
		function createChild(custom) {
			isCreatingChildProcess = true;
			custom = custom || {};
			var Model = createClass.apply(this, arguments);
			createProto.apply(this, [Model, custom]);
			isCreatingChildProcess = false;
			return Model;
		}
	
		// Creating model class
		function createClass() {
			var Model = getConstructor();
			return upgradeClass.apply(this, [Model]);
		}
	
		function upgradeClass(Model) {
			utils.extend.apply(this, [Model, builderParams.classProps]);
			Model.private('_sys', createStorage(true));
			utils.extend.apply(this, [Model, builderParams.computeClass, true]);
			classParentSupport.apply(this, arguments);
			return Model;
		}
	
		// Creating model prototype
		function createProto(Model, custom) {
			var proto = new this(),
				init = custom.init;
	
			custom.init = undefined;
			upgradeProto.apply(Model, [proto, custom]);
	
			Model.prototype = proto;
			Model.extendInit(init);
			return Model;
		}
	
		function upgradeProto(proto, custom) {
			if(isCreatingBaseProcess) {
				utils.extend.apply(this, [proto, builderParams.protoProps]);
			}
			utils.extend.apply(this, [proto, builderParams.computeProto, true]);
			utils.extend.apply(this, [proto, custom]);
	
			var storage = this.private('_sys'),
				subProto = storage.subProto;
	
			utils.extend.apply(this, [proto, subProto.computeProto, true]);
			return proto;
		}
	
		// add parent behaviour to new Model
		function classParentSupport(Model) {
			var storage = Model.private('_sys');
	
			if(isCreatingBaseProcess) {
				return Model;
			}
	
			var parentStorage = this.private('_sys');
	
			// support of inherits Model subPrototype
			var parentSubProto = parentStorage.subProto,
				subProto = storage.subProto;
	
			utils.extend(subProto.protoProps, parentSubProto.protoProps);
			utils.extend(subProto.computeProto, parentSubProto.computeProto);
			utils.extend(subProto.classProps, parentSubProto.classProps);
			utils.extend(subProto.computeClass, parentSubProto.computeClass);
	
			// add parent behaviour
			utils.extend.apply(this, [Model, subProto.classProps]);
			utils.extend.apply(this, [Model, subProto.computeClass, true]);
			return Model;		
		}
	};

	var privateComponent = function() {
		return {
			name: 'private',
			run: function() {
				var obj = {
					private: privateStorage
				};
	
				this.extendClass(obj).extendProto(obj);
			}
		};
	
		function privateStorage(key, value) {
			if(!key) {
				return null;
			}
			var storage = getStorage.apply(this);
			if(arguments.length < 2) {
				return storage[key];	
			}
			return storage[key] = value;
		}
	
		function getStorage() {
			var storage = this._privateStorage;
			if(storage) {
				return storage;
			}
			return defineStorage.apply(this);
		}
	
		function defineStorage() {
			Object.defineProperty(this, '_privateStorage', {
				value: {}
			});
			return this._privateStorage;
		}
	};

	var uniqueComponent = function() {
		return {
			name: 'unique',
			run: function() {
				this.extendClass({
						getUnique: getModeUnique
					})
					.extendProto({
						uniqueKey: 'id',
						getUnique: getInstanceUnique
					});
			}
		};
	
		function getModeUnique() {
			return this.MODEL_ID;
		}
	
		function getInstanceUnique() {
			var instKey = this.uniqueKey,
				instValue = this[instKey];
	
			return genInstanceUnique.apply(this, [instKey, instValue]);
		}
	
		function genInstanceUnique(key, value) {
			return this.Model.getUnique() + '/' + key + '/' + value;		
		}
	};

	var initComponent = function() {
		return {
			name: 'init',
			run: function() {
				this.extendProto({
						addInit: addInstanceInit
					})
					.extendClass({
						extendInit: extendInit
					})
					.extendClass({
						makeClassInits: function(Model) {
							supportInitsInherit(this, Model);
						}
					}, true)
					.extendInit(managerInits);
			}
		};
	
		function extendInit(cb, isBefore) {
			if(typeof cb !== 'function') {
				return false;
			}
			var inits = this.private('_sys').inits,
				cbs = inits.cbs;
	
			if(typeof isBefore === 'boolean') {
				cbs = isBefore ? inits.before : inits.after;
			}
	
			cbs.push(cb);
			return this;
		}
	
		function addInstanceInit(cb) {
			extendInit.apply(this, [cb]);
			cb.apply(this, this.private('_sys').args);
			return this;
		}
	
		function supportInitsInherit(parent, child) {
			var childInits = genStorage();
			child.private('_sys').inits = childInits;
	
			if(!parent.isModel) {
				return false;
			}
			var parentInits = parent.private('_sys').inits
	
			childInits.before = parentInits.before.slice();
			childInits.cbs = parentInits.cbs.slice();
			childInits.after = parentInits.after.slice();
			
			return childInits;
		}
	
		function genStorage() {
			return {
				before: [],
				cbs: [],
				after: []
			}
		}
	
		function managerInits() {
			var storage = this.private('_sys') || {},
				inits = storage.inits,
				result;
	
			if(!inits) {
				this.private('_sys', storage);
				inits = supportInitsInherit(this.Model, this)
			}
	
			// cache inst arguments
			storage.args = arguments;
	
			result = runInits.apply(this, [inits.before, arguments]);
			result = result.status ? runInits.apply(this, [inits.cbs, arguments]) : result;
			result = result.status ? runInits.apply(this, [inits.after, arguments]) : result;
	
			return result;
		}
	
		function runInits(inits, instArgs) {
			var status = true,
				result,
				method;
	
			for(var i = 0; inits.length > i; i++) {
				method = inits[i];
				result = method.apply(this, instArgs);
				status = (typeof result === 'boolean' && !result)? false : status;
	
				if(!status) {
					break;
				}
			}
	
			return {
				status: status,
				method: method
			};
		}
	};
	

	var instanceModelComponent = function() {
		return {
			name: 'instanceModel',
			run: function() {
				this.extendProto({
					Model: defineInstanceModel
				}, true);
			}
		};
	
		function defineInstanceModel() {
			return this;
		}
	};

	var modelIdComponent = function() {
		var MODEL_ID = 0;
	
		return {
			name: 'modelId',
			run: function() {
				this.extendClass({
					MODEL_ID: genModelId
				}, true);
			}
		};
	
		function genModelId() {
			return MODEL_ID++;
		}
	};

	var parentsComponent = function() {
		return {
			name: 'parents',
			run: function() {
				this.extendClass({
					parents: function defineModelParents() {
						var parents = (this.parents || []).slice(0);
						parents.push(this);
						return parents;
					}
				}, true);
			}
		};
	};

	var parentComponent = function() {
		return {
			name: 'parent',
			run: function() {
				this.extendClass({
					parent: defineModelParent
				}, true);
			}
		};
	
		function defineModelParent() {
			return this;
		}
	};

	var childsComponent = function() {
		return {
			name: 'childs',
			run: function() {
				this.extendClass({
					childs: function defineModelChilds(Model) {
						var parents = this.parents || [];
						for(var i = 0; parents.length > i; i++) {
							(this.parents[i].childs || []).push(Model);
						}
						(this.childs || []).push(Model);
						return [];
					}
				}, true);
			}
		};
	};


	var componentsIntegrator = (function() {

		var components = [];

	

		return function(Model) {

			var obj = {

				component: add

			};

	

			Model

				.extendClass(obj)

				.extendProto(obj)

				.extendClass({

					makeChild: function(Model) {

						inheritSupport(this, Model);

					}

				}, true)

				.extendInit(function() {

					inheritSupport(this.Model, this);

				});

		};

	

		function genStorage() {

			return {

				reg: {},

				use: {}

			};

		}

	

		function inheritSupport(parent, child) {

			var storage = child.private('_sys'),

				components = genStorage();

	

			storage.components = components;

	

			if(!parent.isModel) {

				return undefined;

			}

	

			var parentComponents = parent.private('_sys').components;

	

			components.use = Object.create(parentComponents.use);

			components.reg = Object.create(parentComponents.reg);

			return undefined;

		}

	

		function add(component) {

			if(!component) {

				var self = this;

				return {

					reg: reg.bind(self),

					use: use.bind(self)

				};

			}

	

			reg.apply(this, [component]);

			return use.apply(this, [component.name]);

		}

	

		function reg(component) {

			if(!!~components.indexOf(component)) {

				return component;

			}

	

			components.push(component);

			var index = components.length - 1;

			this.private('_sys').components.reg[component.name] = index;

			return component;

		}

	

		function use(name) {

			if(!name) {

				return false;

			}

			var isModel = this.isModel,

				Model = isModel? this : this.Model,

				storage = this.private('_sys').components,

				index = storage.reg[name],

				component = components[index];

	

			if(!component) {

				throw 'This component "'+ name +'" is not registered!';

				return false;

			}

	

			if(component.proto) {

				Model.extendProto(component.proto);

			}

	

			if(component.init) {

				if(isModel) {

					Model.extendInit(component.init);

				} else {

					this.addInit(component.init);

				}

			}

			storage.use[name] = index;

			return true;

		}

	})();

	

	var abstractComponent = {
		name: 'abstract',
		proto: {
			abstract: false
		},
		init: function() {
			if(!this.abstract) {
				return true;
			}
			throw 'This Model is abstract!';
			return false;
		}
	};


	var modelBuilder = new ModelBuilder();

	modelBuilder
		.component(inheritanceComponent)
		.component(privateComponent)
		.component(uniqueComponent)
		.component(initComponent)
		.component(instanceModelComponent)
		.component(modelIdComponent)
		.component(parentsComponent)
		.component(parentComponent)
		.component(childsComponent);
	
	var Model = modelBuilder.create();

	componentsIntegrator(Model);
	Model.component(abstractComponent);

	return Model;
}

module.exports = createModel();