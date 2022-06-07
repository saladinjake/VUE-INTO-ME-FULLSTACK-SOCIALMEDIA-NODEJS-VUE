# VUE-INTO-ME-FULLSTACK-SOCIALMEDIA-NODEJS-VUE
- A social media application with nodejs mongodb and vue js. from authentication,
- realtime chat and more.. 
- Basically meets the need to show how building enterprise software , DEPLOY TO aws , code modularization, oop encapsulation 
- A prototype enterprise structure .
- ADMIN MANAGEMENT
## dump files to local mogo as seed files


mongodump --uri mongodb+srv://goomauthor:Saladin12345678910@cluster0.sf9py.mongodb.net/fairydiary_api_test_db  -o   C:\Users\Obiajulu\Desktop\VUE-INTO-ME-FULLSTACK-SOCIALMEDIA-NODEJS-VUE-master\backend\seeders



## import from local db to mongo cloud

mongorestore -d fairydiary_api_test_db --uri mongodb+srv://goomauthor:Saladin12345678910@cluster0.sf9py.mongodb.net/fairydiary_api_test_db     C:\Users\Obiajulu\Desktop\VUE-INTO-ME-FULLSTACK-SOCIALMEDIA-NODEJS-VUE-master\backend\seeders






# export db collecton to folder
mongodump -d fairydiary_api_test_db -o  C:\Users\Obiajulu\Desktop\VUE-INTO-ME-FULLSTACK-SOCIALMEDIA-NODEJS-VUE-master\backend\seeders\seed