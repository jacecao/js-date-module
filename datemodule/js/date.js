// 日期数据实现功能模块
(function () {
	// 定义日期数据获取对象
	var datepicker = {};
	// 给对象添加获取月份日期的功能
	// getMonthData 主要获取制定月份的日期数据
	// 该方法接受2个非必须的数值参数，年份、月份  
	datepicker.getMonthData = function (year, month) {
		// 定义一个数组用于储存指定月份的日期数据
		var ret = [];
		
		// 首先取得当前日期
		var today = new Date();
		var today_year = today.getFullYear();
		var today_month = today.getMonth() + 1; // 注意月份是从 0—11 这样编序的
		var today_date = today.getDate();

		// 只给了其中一个参数
		// 如果只给了年份，那么月份为当前月份
		// 如果只给了月份，那么年份为当前年份
		if (year && !month) {
			// 如果只传来一个参数，那么函数只会显示month缺失的提示
			// 接下来我们需要对传入的year参数进行
			// 如果是不大于12那么这个参数是月份
			var _year = parseInt(year);
			if (!month && 0 < _year && _year < 13) {
				month = _year; // 将当前的年份参数赋值给月份
				year = today_year; // 将当前的年份赋值给年份参数
			} else if ( 1977 <= _year && _year <= 2040) {
			// 如果大于1977（这个我们可以指定能查询的年份范围）小于2040年
			// 那么这个参数是年份
				month = today_month;
				year = _year;
			} else {
				console.error('对不起在datepicker对象中的getMonthData()函数传参错误');
				console.info('你输入的参数为：' + year);
				console.info('如果你传入的是月份那么必须是1-12这个范围，如果是年份那么必须是1977-2040这个范围');
			}	 
		}
		// 两个参数都给
		if (year && month) {
			// 这里就做一个暴利的判定，不再细化了
			1977 <= parseInt(year) && parseInt(year) <= 2040 ? year = parseInt(year) : year = today_year;
			0 < parseInt(month) && parseInt(month) < 13 ? month = parseInt(month) : month = today_month;
		}
		// 如果没有传参数
		if (!year && !month) {
			// 那么将当前的年月份赋值给参数
			year = today_year;
			month = today_month;
		}

		// 获取指定月份的第一天时间信息
		// 注意这里并不是获取第一天（不是获取1号）
		// month - 1 这个上面已经说了 函数中当前的月份是当前月份减一
		var currMonth_firstDayData = new Date(year, month - 1, 1);
		// 查看当前月份第一天是星期几, getDay()返回的是0-6七个数
		var currMonth_firstDay_week = currMonth_firstDayData.getDay();
		currMonth_firstDay_week === 0 ? currMonth_firstDay_week = 7 : 
										currMonth_firstDay_week;
		// 获取当前月份的最后一天
		 var currMonth_lastDayData = new Date(year, month, 0);
		 var currMonth_lastDay = currMonth_lastDayData.getDate();

		// 获取上个月份的信息，主要是获取当前月份的上个月的最后一天的信息
		var prevMonth_lastDayData = new Date(year, month - 1, 0);
		var prevMonth_lastDay = prevMonth_lastDayData.getDate();

		// 获取下个月的信息
		// var nextMonth_firstDayData = new Date(year, month, 1);
		// var nextMonth_firstDay = nextMonth_firstDayData.getDate();

		// 计算在当前月份中需要显示多少上月份的天数
		// 这里的计算方式需要依据日期显示界面(UI)的布局来区分
		// 在这里我们从周一开始排序至周日那么计算方式就是：当前星期数 - 1；
		// 周一 显示0个上月天数  周二 显示1个上月天数 .............
		// 如果UI布局从周六 周日 周一 这样排序的：thisDay.getDay() + 1 （当==7就显示0）
		// 周六  6 + 1 == 7 不显示上个月天数
		// 周日  0 + 1 = 1 显示1个上个月天数
		// 周一  1 + 1 = 2 显示2个上个月天数
		var show_prevMonthDay_count = currMonth_firstDay_week - 1;
		// 这里我们需要计算当前显示月份的界面中每个位置需要显示的day
		// 需要注意的是这个day可能包括上个月的天数和下个月的天数
		// 我们把显示这个月份界面看着是一个容器，用于装day数据
		// 那这个容器的大小怎么确定呢（即到底我们需要使用几行来装day）
		// 我们可以这样计算：当前月份最后天 + 上个月显示天数 < = 35 那么只需要5行
		// 当前月份最后天 + 上个月显示天数 > 35 那么需要6行(最多6行)
		/* 这里最好看着真实的日历细想为什么有这样的计算 这样就能很快理解了 */
		var _sum_day = show_prevMonthDay_count + currMonth_lastDay;

		var line; // 需要显示的行数
		var thisDate; // 储存当前显示日期
		var thisMonth; // 储存当前日期的月份
		var thisYear = year; // 储存当前日期的年份
		var thisStatus = true; // 储存当前日期状态（即是否为本月的日期）
		var isToday = false; // 显示的日期是否为今天

		_sum_day <= 35 ? line = 5 : line = 6;
		// 开始遍历装day的容器（遍历每个装天数的格子）
		for (var i = 0; i < 7 * line; i++) {
			/* 这里的处理方法并不巧妙，显得笨拙，但对我们理清思路是非常重要的
			// 判断需要显示上个月的天数
			if (show_prevMonthDay_count > 0) {
				thisDay = prevMonth_lastDay - show_prevMonthDay_count + 1; // 注意这里需要加1
				show_prevMonthDay_count--; // 这里需要递减（这里其实应该与i循环来发生关系）
				thisMonth = month - 1
				thisStatus = false;
			}
			// 判断是否属于当前月份的天数
			// 这里i + 1 - show_prevMonthDay_count 需要好好理解一下
			if ((i + 1) > show_prevMonthDay_count && (i + 1 - show_prevMonthDay_count) <= currMonth_lastDay) {
				thisDay = i + 1 - show_prevMonthDay_count;
				thisStatus = true;
			}
			// 判断需要显示下个月的天数
			if ((i + 1 - show_prevMonthDay_count) > currMonth_lastDay) {
				thisDay = i + 1 -show_prevMonthDay_count - currMonth_lastDay;
				thisMonth = month + 1;
				thisStatus = false;
			}
			*/
			// 更好的处理办法 
			var date = i + 1 - show_prevMonthDay_count; // 我们根据这个值来判断日期显示区间
			if (date <= 0) {
				// 小于0 表示需要显示上个月的日期
				thisMonth = month - 1;
				thisDate = prevMonth_lastDay + date;
				thisStatus = false;
			} else if (date > currMonth_lastDay) {
				// 这里意思是超越了本月需要显示的天数，那么意思显示下一个月的天数
				thisMonth = month + 1;
				thisDate = date - currMonth_lastDay;
				thisStatus = false;
			} else {
				// 属于本月日期
				thisMonth = month;
				thisDate = date;
				// 如果date 与今天的日期相等 那么将isToday变为true
				if (date === today_date) {
					isToday = true;
				} else {
					isToday = false;
				}
				thisStatus = true;
			}
			// 需要对月份做一个处理
			if (thisMonth === 0) {
				thisMonth = 12;
				thisYear = year - 1;
			}
			if (thisMonth === 13) {
				thisMonth = 1;
				thisYear = year + 1;
			}
			ret.push({
				year: thisYear, // 当前日期所在的年份
				month: thisMonth, // 当前日期所在的月份
				date: thisDate, // 当前日期
				status: thisStatus, // 当前日期是否为本月的日期
				baseYear: year, // 当前指定参数的年份
				baseMonth: month, // 当前指定参数的月份
				today: isToday // 记录当前日期是否为今天
			});
		}
		return ret;
	}
	// 将时间模块对象注入全局
	window.datepicker = datepicker;
})()