var config = {
	parentDomain : 'http://localhost:8083', 	//Host Domain
	web_port : process.env.WEB_PORT || 3000,							//Port where app will be hosted
	admin_url : '/adminURL',					//Choose a URL where admin panel can be accessed
	redis_port : 6379,							//Redis Port
	redis_hostname : "localhost", 				//Redis Hostname 
	admin_users : ['admin','mohit'], 					//Add usernames for different admins
	key : process.env.REDIS_PASSWORD_HASH || ''						//Admin Password btoa hashed (Default = 'password')
};

module.exports = config;