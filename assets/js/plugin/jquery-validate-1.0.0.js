(function(global, factory, plug) {
	factory.call(global, global.jQuery, plug);
}(typeof window === 'undefined' ? this : window, function($, plug) {
	//默认配置
	var _DEFS_ = {
			raise: "change",
			pix: "bv-"
		}
		//默认规则引擎
	var _RULES_ = {
		"require": function() {
			if (this.val() && this.val() !== "") {
				return true;
			}
		},
		"number": function() {
			return !isNaN(this.val());
		},
		"integer": function() {
			return true;
		},
		"email": function() {
			if (this.val() && this.val() !== "") {
				return this.val().match(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);
			}
		},
		"length": function() {
			return this.data(_DEFS_.pix + 'length') == this.val().length;
		},
		"regex": function() {
			return new RegExp(this.data(_DEFS_.pix + 'regex')).test(this.val())
		}
	}

	$.fn[plug] = function(ops) {
		if (this.is("form")) {
			var that = $.extend(this, _DEFS_, ops); //先扩展默认值，再用用户设置的值覆盖默认值
			var $fields = this.find("input,textarea,select").not("[type=submit],[type=button],[type=reset]");
			var isSubmit = true;
			//鼠标移开表单元素的时候 开始校验元素
			$fields.on(this.raise, function() {
				validate(this);
			})
			this.on('submit', function(e) {
				console.log('submit')
				$fields.each(function(i, item) {
					validate(item);
					if (!isSubmit) {
						e.preventDefault();
					}
				})
			});

			function validate(item) {
				var $fields = $(item);
				var result = false;
				var $group = $fields.parents('.form-group:first');
				var msg = "";
				$group.removeClass('has-success has-error');
				$fields.siblings('.help-block').remove();
				$.each(_RULES_, function(rule, active) {
					if ($fields.data(that.pix + rule)) {
						result = active.call($fields);
						if (!result) {
							$group.addClass('has-error');
							msg = $fields.data(that.pix + rule + '-message');
							$fields.after('<span class="help-block">' + msg + '</span>')
								//验证失败
							isSubmit = false;
							return false;
						} else {
							//验证成功
							$group.addClass('has-success');

						}
					}
				})
			}
			//扩展
			this.extendRules = $.fn[plug].extendRules;
			return this;
		} else {
			throw new Error('目标元素非表单元素');
		}
	}
	$.fn[plug].extendRules = function(rules) {
		$.extend(_RULES_, rules);
	}
}, 'bootstrapValidator'));
// var a = {
// 	factory: function($, plug) {
// 		console.log(111)
// 		console.log(this)
// 	}
// }
// function factory($, plug) {
// 	console.log(111)
// 	console.log(this)
// }
// a.factory()
// a.factory.call(window, window.$, 'a');