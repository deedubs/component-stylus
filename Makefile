test: 
	@NODE_ENV=test ./node_modules/.bin/mocha --ui bdd --reporter spec test/*.js

.PHONY: test