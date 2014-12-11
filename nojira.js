#!/usr/bin/env node

var app = require('commander');
var output = require('better-console');
var JiraApi = require('jira').JiraApi;
var config = require(process.env['HOME'] + '/.nojirarc.json');

var jira = new JiraApi('http', config.host, config.port, config.user, config.password, 2);

app.version('1.0.0');

app
	.command('find <issueKey>')
	.description('Displays details of specified issue')
	.action(function (issueKey) {
		jira.findIssue(issueKey, function (error, issue) {
			var table = {};
			table[issueKey.replace('-', '')] = {
				"name": "[" + issue.fields.issuetype.name + "] " + issue.fields.summary.match(/.{1,20} /g).join("\n"),
				"status": issue.fields.status.name,
				"creator \\ assignee": issue.fields.creator.displayName + "\n" + issue.fields.assignee.displayName,
				"priority": issue.fields.priority.name
			};
			output.table(table);
			process.exit(0);
		});
	});

app.parse(process.argv);

if (!app.args.length) app.help();
