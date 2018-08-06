from neo4j.v1 import GraphDatabase, basic_auth
import json

"""
File Format:
NER File:
  label entity
  ex: Heineken organisation
Relationships File:
   label1 rel label2
Properties/Coreference File:
   node "also known as" corefChain
"""

class graph:
   def __init__(self, path, uname, pswd ):
      self.graphConfig = {
        "username" : uname,
        "password" : pswd,
        "url" : path
      };
   def initialise(self):
      self.driver  = GraphDatabase.driver(self.graphConfig["url"], auth=basic_auth(self.graphConfig["username"], self.graphConfig["password"]))
      self.session = self.driver.session()
   def insertNode(self, label, entity, k, v):
      query = "CREATE (" + label + ":" + entity + "{" + k  + ":" + v  + '})';
      print(query)
      self.session.run(query)

#driver = GraphDatabase.driver("bolt://localhost:7687", auth=basic_auth("neo4j", "halkarni.89"))
#sess = driver.session()
#sess.run("CREATE (TheMatrix:Movie {title: 'The Matrix', released:1999, tagline: 'Welcome to the Real World'})")
#"CREATE (500 Days of Summer:Movie{"release": 2002, "title": "500 Days of Summer"})"

g = graph("bolt://localhost:7687", "neo4j", "halkarni.89")
g.initialise()
prop = {'title':'"Days of Summer"','release':2002}
g.insertNode("Days", "Movie", "title", '"days of summer"')
