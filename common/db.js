// 打开数据库
function openDB(name) {
	plus.sqlite.openDatabase({
		name: name,
		path: name == 'data' ? '_doc/collectionData.db' : '_www/static/dictDB/NewDict.db',
		success: function(e) {
			console.log('打开数据库成功');
		},
		fail: function(e) {
			console.log('打开数据库失败: ' + JSON.stringify(e));
		}
	});
}
// 关闭数据库
function closeDB(name) {
	plus.sqlite.closeDatabase({
		name: name,
		success: function(e) {
			console.log('关闭数据库成功!');
		},
		fail: function(e) {
			console.log('关闭数据库失败: ' + JSON.stringify(e));
		}
	});
}
// 创建表语句
function executeSQL(sql) {
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	plus.sqlite.executeSql({
		name: 'data',
		sql: `${sql}`,
		success: function(e) {
			console.log('创建表成功!');
		},
		fail: function(e) {
			console.log('创建表失败: ' + JSON.stringify(e));
		}
	});
}
// 查询字典表
function SelectDict(that, table, type, condition) {
	plus.sqlite.selectSql({
		name: 'dict',
		sql: table == 't_sys_code' ?
			`select id,pid,code,name from ${table} where ${type}=${condition} and status = 1 and visiable=1` : `select id,content,type from ${table} where ${type}=${condition}`,
		success: function(e) {
			if (table == 't_sys_code') {
				that.array = e
			} else if (table == 't_sys_label') {
				that.dictArr = e
			}
			console.log('查询字典表成功!', JSON.stringify(e));
		},
		fail: function(e) {
			console.log('查询字典表失败: ' + JSON.stringify(e));
		}
	});
}

function SelectData(that, type, sql, ifCount,callback) {
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	plus.sqlite.selectSql({
		name: 'data',
		sql: sql,
		success: function(e) {
			if (ifCount) {
				if (type == 'person') {
					that.personNum = e[0].count
				} else if (type == 'car') {
					that.carNum = e[0].count
				}
			} else {
				if (type == 'person') {
					//格式化数据结构
					for (let item of e) {
						item.data = JSON.parse(item.data)
					}
					that.dataList = e
					if(callback){
						callback(e)
					}
				}
			}
		},
		fail: function(e) {
			console.log('查询数据失败: ' + JSON.stringify(e));
		}
	});
}

function SelectCheck(that, sql, type) {
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	plus.sqlite.selectSql({
		name: 'data',
		sql: sql,
		success: function(e) {
			switch (type) {
				case 'checkCount':
					that.checkCount = e[0].checkCount
					break;
				case 'checkExceptionCount':
					that.checkExceptionCount = e[0].checkExceptionCount
					break;
				case 'checkToday':
					that.checkToday = e[0].checkToday
					break;
				case 'checkExceptionToady':
					that.checkExceptionToady = e[0].checkExceptionToady
					break;
				default:
					break;
			}
			console.log('查询数据成功!', JSON.stringify(e));
		},
		fail: function(e) {
			console.log('查询数据失败: ' + JSON.stringify(e));
		}
	});
}
function updataSql (sql){
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	console.log(sql)
	plus.sqlite.executeSql({
		name: 'data',
		sql: `${sql}`,
		success: function(e) {
			console.log('修改数据成功');
		},
		fail: function(e) {
			console.log('修改数据失败: ' + JSON.stringify(e));
		}
	});
}
function insertData(that, type, sql) {
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	plus.sqlite.executeSql({
		name: 'data',
		sql: `${sql}`,
		success: function(e) {
			console.log(e)
			console.log('插入数据成功');
			if (type == 'addPerson') {

			} else {
				uni.navigateTo({
					url: "/pages/map/map"
				})
			}

		},
		fail: function(e) {
			console.log('插入数据失败: ' + JSON.stringify(e));
		}
	});
}
// 删除数据库
function deleteTable(table) {
	// 判断数据库是否打开了 没打开的情况下，要打开
	var isOpen = plus.sqlite.isOpenDatabase({
		name: 'data', //数据库的名字  
		path: '_doc/collectionData.db' //地址  
	});
	if (!isOpen) {
		openDB('data')
	}
	plus.sqlite.executeSql({
		name: 'data',
		sql: `delete from ${table}`,
		success: function(e) {
			console.log('删除数据库成功');
			// uni.hideLoading()
		},
		fail: function(e) {
			console.log('删除数据库失败: ' + JSON.stringify(e));
		}
	});
}
export {
	openDB,
	executeSQL,
	SelectDict,
	closeDB,
	SelectData,
	insertData,
	SelectCheck,
	deleteTable,
	updataSql
}
