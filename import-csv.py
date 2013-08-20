# -*- coding: utf-8 -*-
#!/usr/bin/python

import sys
import re
import urllib2
import csv
import json


#resp = open('wahlthesen.csv', 'rb')
resp = urllib2.urlopen('https://docs.google.com/spreadsheet/pub?key=0AvGg4dcjWJP8dE1kNkJHU3UwaWlDcGhneDNITm5SZlE&output=csv')
reader = csv.reader(resp)

questions = []
answer_sets = []

class NoPartei(Exception):
    pass

def answer2num(a):
    if a == 'Ich stimme absolut nicht zu.':
	return '1'
    if a == 'Ich stimme eher nicht zu.':
	return '2'
    if a == 'Ich bin unentschieden.':
	return '3'
    if a == 'Ich stimme eher zu.':
	return '4'
    if a == 'Ich stimme absolut zu.':
	return '5'
    return '0'

def partei(p):
    if p == 'Piratenpartei':
	return 'piraten'
    if p == 'CDU':
	return 'cdu'
    if p == 'CSU':
	return 'csu'
    if p == 'Bündnis 90/Die Grünen':
	return 'gruene'
    if p == 'SPD':
	return 'spd'
    if p == 'Die Linke':
	return 'linke'
    if p == 'Freie Wähler':
	return 'fw'
    if p == 'FDP':
	return 'fdp'
    if p == '':
	raise NoPartei()
    raise Exception('"Partei" not recognized: "%s"!' % p)

rownum = 0
for row in reader:
    # header
    if rownum == 0:
	colnum = 0
	_id = 0
	# questions
	for col in row:
	    if colnum != 0:
		r = re.match(r'^\d+\. (.+)$', col)
		if (r):
		    questions.append({
			    'id': _id,
			    'text': r.group(1),
			    })
		    _id += 1
	    colnum += 1

    # data
    else:
	answers = ''
	notes = {}
	try:
	  for i in xrange(1, 70, 2):
	      answer_idx = i / 2
	      answers += answer2num(row[i])
	      note = row[i + 1].strip()
	      if len(note) > 0:
		  notes[answer_idx] = note
	  answer_set = [
	      # partei
	      partei(row[0]),
	      # bundesland
	      row[72],
	      # gender
	      row[71] == 'weiblich' and 'w' or 'm',
	      # answers
	      answers
	  ]
	  if len(notes) > 0:
	      answer_set.append(notes)
	  answer_sets.append(answer_set)
	except NoPartei:
	    sys.stderr.write('Warning: Number %d does not have "Partei". Skipping!\n' % rownum)
	    continue
	except Exception as e:
	    sys.stderr.write('Could not process opinion number %d\n' % rownum)
	    sys.stderr.write('%s\n' % row)
	    raise e

    rownum += 1

def make_module(data):
	return 'define(function() { return %s; });' % json.dumps(data)

f = open('app/data/wahlthesen.js', 'w')
f.write(make_module(answer_sets))
f.close()

f = open('app/data/questions.js', 'w')
f.write(make_module(questions))
f.close()
