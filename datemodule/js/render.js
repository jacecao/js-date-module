(function () {
	// 渲染数据的HTML结构
	var datepicker = window.datepicker;
	// 构建HTML结构
	datepicker.buildHTML = function (date_data) {
		// 获取月份数据，这里是一个对象数组
		// 参数date_data 为时一个对象数组 保存了本月份需要显示的日期信息
		// 该参数是通过datepicker.getMonthData()生成的
		var monthData = date_data;
		// 构建HTML结构，结构参见static中的test.html文件中的结构
		var html = 
		'<div class="date-module-header">' +
			'<button class="date-module-button date-module-button-prev">&lt;</button>' +
			'<button class="date-module-button date-module-button-next">&gt;</button>' +
			'<span class="date-module-title">' + monthData[0].baseYear + '-' + monthData[0].baseMonth + '</span>' +
		'</div>' +
		'<!-- 组件内容体 -->' +
		'<div class="date-module-body">' +
			'<table class="date-module-table">' +
				'<tr class="date-module-week">' +
					'<th>周一</th>' +
					'<th>周二</th>' +
					'<th>周三</th>' +
					'<th>周四</th>' +
					'<th>周五</th>' +
					'<th>周六</th>' +
					'<th>周日</th>' +
				'</tr>';
				for (var i = 0; i < monthData.length; i++) {
					// 这里需要判断什么时候需要加tr开始标签和结束标签
					// 这里的结构关系非常重要，尤其是执行的顺序
					if (i % 7 === 0) {
						html += '<tr class="date-module-day">';
					}
					if (!monthData[i].status) {
						html += '<td class="date-module-day-gray" data-index="' + i + '">' + monthData[i].date + '</td>';
					} else if (monthData[i].today) {
						html += '<td class="date-module-day-active" data-index="' + i +'">' + monthData[i].date + '</td>'
					} else {
						html += '<td data-index="' + i + '">' + monthData[i].date + '</td>';
					}
					if (i % 7 === 6) {
						html += '</tr>';
					}
				}
		html += 
			'</table>' +
		'</div>';
		// 返回该容器
		return html;
	}
	// 将HTML结构加入到页面中
	datepicker.renderHTML = function (direction) {
		// 首先从页面中获取日历容器
		var dateBox = document.querySelector('.date-module-main');
		// 如果页面中没有日历容器
		if (dateBox === null) {
			// 创建日历容器
			dateBox = document.createElement('section');
			dateBox.className = 'date-module-main';
			document.body.appendChild(dateBox);
		}
		// this.dateData是初始化模块时储存的当月日期数据信息（对象数组）
		// 这里我们大部分数据都通过对象属性来传递，而不使用全局变量
		// 这样也是为了保证变量的可控和模块的可维护性
		var monthData = this.dateData;
		var year = this.date.year;
		var month = this.date.month;
		if (direction) {
			// 如果有参数传入那么，就需要重新获取当月日期数据信息
			// 这里一旦有参数传入，说明需要切换月份（前后左右月份的切换)
			// 我们需要根据不同的切换方式来更新月份和年份信息
			// 并将更新后的月份和年份存到对象的date属性中（这很重要）
			switch (direction) {
				// 获取上一月数据
				case 'prev':
					month --;
					if (month === 0) {
						year --;
						month = 12;
					}
					break;
				// 获取下一月数据 
				case 'next':
					month ++;
					if (month === 13) {
						year ++;
						month = 1;
					}
					break;
			}
			// 更新模块中的年月信息
			this.date.year = year;
			this.date.month = month;
			// 也需要重新获取月份数据
			monthData = this.getMonthData(year, month);
			// 更新模块对象中的日期数据（很重要）
			this.dateData = monthData;
		}
		// 获取重构后的HTML结构
		var html = this.buildHTML(monthData);
		// 将HTML结构加入到页面中
		dateBox.innerHTML = html;
		// 将容器保存到模块对象中
		this.date_ele = dateBox;
	}
	// 模块初始化，参数为一个对象
	// 包含以下几个属性
	// year 指定时间开始的年份
	// month 指定时间开始的月份
	// element 触发日历显示的元素(classname,id) (必须)
	datepicker.init = function (obj) {
		// 初始获取最初的日期信息并存储到模块对象中
		this.dateData = this.getMonthData(obj.year, obj.month);
		var date_info = this.dateData[0];
		// 在初始化日期数据后，这里将给模块创建date属性，用于保存初始的年、月信息
		// 这里不采用参数给的年月，是因为参数有可能不会给年月
		this.date = {year: date_info.baseYear, month: date_info.baseMonth};
		// 执行页面渲染
		this.renderHTML();
		var dateBox = this.date_ele;
		// 获取触发元素
		var ele = document.querySelector(obj.element);
		var isShow = false; // 日历是否显示
		if (ele !== null) {
			// 对触发元素添加点击事件监听
			// 控制日历的显示和关闭
			ele.addEventListener('click', function () {
				if (isShow) {
					dateBox.classList.remove('date-module-show');
					isShow = false;
				} else {
					dateBox.classList.add('date-module-show');
					isShow = true;
					// 对dateBox绝对定位
					var left = ele.offsetLeft;
					var top = ele.offsetTop;
					var height = ele.offsetHeight;
					dateBox.style.left = left + 'px';
					dateBox.style.top = top + height + 2 + 'px';
				}
			}, false);
		} else {
			console.error('传入的元素无法获取，如果你传入的是class，需要加以\".\"开头，传入的是元素id，那么需要以\"#\"开头');
		}
		// 为日历容器添加事件监听（这里采用事件代理机制）
		this.date_ele.addEventListener('click', function (e) {
			var ele_active = e.target;
			// 获取上一月信息
			if (ele_active.classList.contains('date-module-button-prev')) {
				datepicker.renderHTML('prev');
			}
			// 获取下一月信息
			if (ele_active.classList.contains('date-module-button-next')) {
				datepicker.renderHTML('next');
			}
			// 获取制定的日期，即点击一个日期时，获取到该日期的完整年月日信息
			var tagname = ele_active.tagName.toLowerCase();
			if (tagname === 'td') {
				var attr_data = ele_active.dataset.index;
				// console.log(datepicker.dateData[attr_data]);
				// 获取到点击日期中自定义data-index中的序列值
				// 根据这个值我们便可以获取到日期信息
				var _date = datepicker.dateData[attr_data];
				// 将获取到的日期信息输入到输入框中，_date其实就是储存日期信息数组中的一个对象
				// 对象中保存了当前日期下的年月等数据信息
				ele.value = _date.year + '-' +_date.month + '-' + _date.date;
				// 选取完毕后关闭日历
				setTimeout(function () {
					dateBox.classList.remove('date-module-show');
					isShow = false;
				}, 200)
			}
		}, false);
		
	}
})()