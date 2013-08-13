#!/usr/bin/python

import re
import urllib2
import csv
import json


resp = open('wahlthesen.csv', 'rb')
# resp = urllib2.urlopen('https://docs.google.com/spreadsheet/pub?key=0AvGg4dcjWJP8dE1kNkJHU3UwaWlDcGhneDNITm5SZlE&output=csv')
reader = csv.reader(resp)

questions = []
answer_sets = []

def answer2num(a):
    if a == 'Ich stimme absolut nicht zu.':
	return -2
    if a == 'Ich stimme eher nicht zu.':
	return -1
    if a == 'Ich bin unentschieden.':
	return 0
    if a == 'Ich stimme eher zu.':
	return 1
    if a == 'Ich stimme absolut zu.':
	return 2
    return None

rownum = 0
for row in reader:
    # header
    if rownum == 0:
	colnum = 0
	for col in row:
	    if colnum != 0:
		r = re.match(r'^\d+\. (.+)$', col)
		if (r):
		    questions.append({ 'text': r.group(1) })
	    colnum += 1

    # data
    else:
	a = {}
        for i in xrange(1, 70, 2):
	    answer_idx = i / 2
	    a[answer_idx] = answer2num(row[i])
	    note = row[i + 1].strip()
	    if len(note) > 0:
		a['%i_note' % answer_idx] = note
	answer_sets.append([
	    # partei
	    row[0],
	    # bundesland
	    row[72],
	    # gender
	    row[71] == 'weiblich' and 'w' or 'm',
	    # answers
	    a
	])

    rownum += 1

# import pprint
# pprint.pprint(output)

f = open('wahlthesen.json', 'w')
f.write(json.dumps(answer_sets))
f.close()

f = open('questions.json', 'w')
f.write(json.dumps(questions))
f.close()
