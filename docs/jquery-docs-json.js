[
          {
            'desc': 'The current SVN version of jQuery.',
            'examples': [],
            'name': 'jquery',
            'params': [],
            'private': 1,
            'property': 1,
            'short': 'The current SVN version of jQuery.',
            'type': 'String'
          },
          {
            'desc': 'The number of elements currently matched.',
            'examples': [
                            {
                              'before': '&lt;img src="test1.jpg"/&gt; &lt;img src="test2.jpg"/&gt;',
                              'code': '$("img").length;',
                              'result': '2'
                            }
                          ],
            'name': 'length',
            'params': [],
            'property': 1,
            'short': 'The number of elements currently matched.',
            'type': 'Number'
          },
          {
            'desc': 'The number of elements currently matched.',
            'examples': [
                            {
                              'before': '&lt;img src="test1.jpg"/&gt; &lt;img src="test2.jpg"/&gt;',
                              'code': '$("img").size();',
                              'result': '2'
                            }
                          ],
            'name': 'size',
            'params': [],
            'short': 'The number of elements currently matched.',
            'type': 'Number'
          },
          {
            'desc': 'Access all matched elements. This serves as a backwards-compatible way of accessing all matched elements (other than the jQuery object itself, which is, in fact, an array of elements).',
            'examples': [
                            {
                              'before': '&lt;img src="test1.jpg"/&gt; &lt;img src="test2.jpg"/&gt;',
                              'code': '$("img").get();',
                              'result': '[ &lt;img src="test1.jpg"/&gt; &lt;img src="test2.jpg"/&gt; ]'
                            }
                          ],
            'name': 'get',
            'params': [],
            'short': 'Access all matched elements.',
            'type': 'Array&lt;Element&gt;'
          },
          {
            'desc': 'Access a single matched element. <tt>num</tt> is used to access the  <tt>num</tt>th element matched.',
            'examples': [
                            {
                              'before': '&lt;img src="test1.jpg"/&gt; &lt;img src="test2.jpg"/&gt;',
                              'code': '$("img").get(1);',
                              'result': '[ &lt;img src="test1.jpg"/&gt; ]'
                            }
                          ],
            'name': 'get',
            'params': [
                          {
                            'desc': 'Access the element in the &lt;tt&gt;num&lt;/tt&gt;th position.',
                            'name': 'num',
                            'type': 'Number'
                          }
                        ],
            'short': 'Access a single matched element.',
            'type': 'Element'
          },
          {
            'desc': 'Set the jQuery object to an array of elements.',
            'examples': [
                            {
                              'code': '$("img").get([ document.body ]);',
                              'result': '$("img").get() == [ document.body ]'
                            }
                          ],
            'name': 'get',
            'params': [
                          {
                            'desc': 'An array of elements',
                            'name': 'elems',
                            'type': 'Elements'
                          }
                        ],
            'private': 1,
            'short': 'Set the jQuery object to an array of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Execute a function within the context of every matched element. This means that every time the passed-in function is executed (which is once for every element matched) the \'this\' keyword points to the specific element.<br><br>Additionally, the function, when executed, is passed a single argument representing the position of the element in the matched set.',
            'examples': [
                            {
                              'before': '&lt;img/&gt; &lt;img/&gt;',
                              'code': '$("img").each(function(){ this.src = "test.jpg"; });',
                              'result': '&lt;img src="test.jpg"/&gt; &lt;img src="test.jpg"/&gt;'
                            }
                          ],
            'name': 'each',
            'params': [
                          {
                            'desc': 'A function to execute',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Execute a function within the context of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Access a property on the first matched element. This method makes it easy to retreive a property value from the first matched element.',
            'examples': [
                            {
                              'before': '&lt;img src="test.jpg"/&gt;',
                              'code': '$("img").attr("src");',
                              'result': 'test.jpg'
                            }
                          ],
            'name': 'attr',
            'params': [
                          {
                            'desc': 'The name of the property to access.',
                            'name': 'name',
                            'type': 'String'
                          }
                        ],
            'short': 'Access a property on the first matched element.',
            'type': 'Object'
          },
          {
            'desc': 'Set a hash of key/value object properties to all matched elements. This serves as the best way to set a large number of properties on all matched elements.',
            'examples': [
                            {
                              'before': '&lt;img/&gt;',
                              'code': '$("img").attr({ src: "test.jpg", alt: "Test Image" });',
                              'result': '&lt;img src="test.jpg" alt="Test Image"/&gt;'
                            }
                          ],
            'name': 'attr',
            'params': [
                          {
                            'desc': 'A set of key/value pairs to set as object properties.',
                            'name': 'prop',
                            'type': 'Hash'
                          }
                        ],
            'short': 'Set a hash of key/value object properties to all matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Set a single property to a value, on all matched elements.',
            'examples': [
                            {
                              'before': '&lt;img/&gt;',
                              'code': '$("img").attr("src","test.jpg");',
                              'result': '&lt;img src="test.jpg"/&gt;'
                            }
                          ],
            'name': 'attr',
            'params': [
                          {
                            'desc': 'The name of the property to set.',
                            'name': 'key',
                            'type': 'String'
                          },
                          {
                            'desc': 'The value to set the property to.',
                            'name': 'value',
                            'type': 'Object'
                          }
                        ],
            'short': 'Set a single property to a value, on all matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Access a style property on the first matched element. This method makes it easy to retreive a style property value from the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p style="color:red;"&gt;Test Paragraph.&lt;/p&gt;',
                              'code': '$("p").css("red");',
                              'result': 'red'
                            }
                          ],
            'name': 'css',
            'params': [
                          {
                            'desc': 'The name of the property to access.',
                            'name': 'name',
                            'type': 'String'
                          }
                        ],
            'short': 'Access a style property on the first matched element.',
            'type': 'Object'
          },
          {
            'desc': 'Set a hash of key/value style properties to all matched elements. This serves as the best way to set a large number of style properties on all matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Test Paragraph.&lt;/p&gt;',
                              'code': '$("p").css({ color: "red", background: "blue" });',
                              'result': '&lt;p style="color:red; background:blue;"&gt;Test Paragraph.&lt;/p&gt;'
                            }
                          ],
            'name': 'css',
            'params': [
                          {
                            'desc': 'A set of key/value pairs to set as style properties.',
                            'name': 'prop',
                            'type': 'Hash'
                          }
                        ],
            'short': 'Set a hash of key/value style properties to all matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Set a single style property to a value, on all matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Test Paragraph.&lt;/p&gt;',
                              'code': '$("p").css("color","red");',
                              'result': '&lt;p style="color:red;"&gt;Test Paragraph.&lt;/p&gt;'
                            }
                          ],
            'name': 'css',
            'params': [
                          {
                            'desc': 'The name of the property to set.',
                            'name': 'key',
                            'type': 'String'
                          },
                          {
                            'desc': 'The value to set the property to.',
                            'name': 'value',
                            'type': 'Object'
                          }
                        ],
            'short': 'Set a single style property to a value, on all matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Retreive the text contents of all matched elements. The result is a string that contains the combined text contents of all matched elements. This method works on both HTML and XML documents.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Test Paragraph.&lt;/p&gt;',
                              'code': '$("p").text();',
                              'result': 'Test Paragraph.'
                            }
                          ],
            'name': 'text',
            'params': [],
            'short': 'Retreive the text contents of all matched elements.',
            'type': 'String'
          },
          {
            'any': [
                       'String html A string of HTML, that will be created on the fly and wrapped around the target.',
                       'Element elem A DOM element that will be wrapped.',
                       'Array&lt;Element&gt; elems An array of elements, the first of which will be wrapped.',
                       'Object obj Any object, converted to a string, then a text node.'
                     ],
            'desc': 'Wrap all matched elements with a structure of other elements. This wrapping process is most useful for injecting additional stucture into a document, without ruining the original semantic qualities of a document.<br><br>The way that is works is that it goes through the first element argument provided and finds the deepest element within the structure - it is that element that will en-wrap everything else.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Test Paragraph.&lt;/p&gt;',
                              'code': '$("p").wrap("&lt;div class=\'wrap\'&gt;&lt;/div&gt;");',
                              'result': '&lt;div class=\'wrap\'&gt;&lt;p&gt;Test Paragraph.&lt;/p&gt;&lt;/div&gt;'
                            }
                          ],
            'name': 'wrap',
            'params': [],
            'short': 'Wrap all matched elements with a structure of other elements.',
            'type': 'jQuery'
          },
          {
            'any': [
                       'String html A string of HTML, that will be created on the fly and appended to the target.',
                       'Element elem A DOM element that will be appended.',
                       'Array&lt;Element&gt; elems An array of elements, all of which will be appended.',
                       'Object obj Any object, converted to a string, then a text node.'
                     ],
            'desc': 'Append any number of elements to the inside of all matched elements. This operation is similar to doing an <tt>appendChild</tt> to all the  specified elements, adding them into the document.',
            'examples': [
                            {
                              'before': '&lt;p&gt;I would like to say: &lt;/p&gt;',
                              'code': '$("p").append("&lt;b&gt;Hello&lt;/b&gt;");',
                              'result': '&lt;p&gt;I would like to say: &lt;b&gt;Hello&lt;/b&gt;&lt;/p&gt;'
                            }
                          ],
            'name': 'append',
            'params': [],
            'short': 'Append any number of elements to the inside of all matched elements.',
            'type': 'jQuery'
          },
          {
            'any': [
                       'String html A string of HTML, that will be created on the fly and prepended to the target.',
                       'Element elem A DOM element that will be prepended.',
                       'Array&lt;Element&gt; elems An array of elements, all of which will be prepended.',
                       'Object obj Any object, converted to a string, then a text node.'
                     ],
            'desc': 'Prepend any number of elements to the inside of all matched elements. This operation is the best way to insert a set of elements inside, at the  beginning, of all the matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;, how are you?&lt;/p&gt;',
                              'code': '$("p").prepend("&lt;b&gt;Hello&lt;/b&gt;");',
                              'result': '&lt;p&gt;&lt;b&gt;Hello&lt;/b&gt;, how are you?&lt;/p&gt;'
                            }
                          ],
            'name': 'prepend',
            'params': [],
            'short': 'Prepend any number of elements to the inside of all matched elements.',
            'type': 'jQuery'
          },
          {
            'any': [
                       'String html A string of HTML, that will be created on the fly and inserted.',
                       'Element elem A DOM element that will beinserted.',
                       'Array&lt;Element&gt; elems An array of elements, all of which will be inserted.',
                       'Object obj Any object, converted to a string, then a text node.'
                     ],
            'desc': 'Insert any number of elements before each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;how are you?&lt;/p&gt;',
                              'code': '$("p").before("&lt;b&gt;Hello&lt;/b&gt;");',
                              'result': '&lt;b&gt;Hello&lt;/b&gt;&lt;p&gt;how are you?&lt;/p&gt;'
                            }
                          ],
            'name': 'before',
            'params': [],
            'short': 'Insert any number of elements before each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'any': [
                       'String html A string of HTML, that will be created on the fly and inserted.',
                       'Element elem A DOM element that will beinserted.',
                       'Array&lt;Element&gt; elems An array of elements, all of which will be inserted.',
                       'Object obj Any object, converted to a string, then a text node.'
                     ],
            'desc': 'Insert any number of elements after each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;How are you?&lt;/p&gt;',
                              'code': '$("p").after("&lt;p&gt;I\'m doing fine.&lt;/p&gt;");',
                              'result': '&lt;p&gt;How are you?&lt;/p&gt;&lt;p&gt;I\'m doing fine.&lt;/p&gt;'
                            }
                          ],
            'name': 'after',
            'params': [],
            'short': 'Insert any number of elements after each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'End the most recent \'destructive\' operation, reverting the list of matched elements back to its previous state. After an end operation, the list of matched elements will  revert to the last state of matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;',
                              'code': '$("p").find("span").end();',
                              'result': '$("p").find("span").end() == [ &lt;p&gt;...&lt;/p&gt; ]'
                            }
                          ],
            'name': 'end',
            'params': [],
            'short': 'End the most recent \'destructive\' operation, reverting the list of matched elements back to its previous state.',
            'type': 'jQuery'
          },
          {
            'desc': 'Searches for all elements that match the specified expression. This method is the optimal way of finding additional descendant elements with which to process.<br><br>All searching is done using a jQuery expression. The expression can be  written using CSS 1-3 Selector syntax, or basic XPath.',
            'examples': [
                            {
                              'before': '&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;, how are you?&lt;/p&gt;',
                              'code': '$("p").find("span");',
                              'result': '$("p").find("span") == [ &lt;span&gt;Hello&lt;/span&gt; ]'
                            }
                          ],
            'name': 'find',
            'params': [
                          {
                            'desc': 'An expression to search with.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Searches for all elements that match the specified expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all elements from the set of matched elements that do not  match the specified expression. This method is used to narrow down the results of a search.<br><br>All searching is done using a jQuery expression. The expression can be written using CSS 1-3 Selector syntax, or basic XPath.',
            'examples': [
                            {
                              'before': '&lt;p class="selected"&gt;Hello&lt;/p&gt;&lt;p&gt;How are you?&lt;/p&gt;',
                              'code': '$("p").filter(".selected")',
                              'result': '$("p").filter(".selected") == [ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'filter',
            'params': [
                          {
                            'desc': 'An expression to search with.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Removes all elements from the set of matched elements that do not  match the specified expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all elements from the set of matched elements that do not match at least one of the expressions passed to the function. This  method is used when you want to filter the set of matched elements  through more than one expression.<br><br>Elements will be retained in the jQuery object if they match at least one of the expressions passed.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;p class="selected"&gt;And Again&lt;/p&gt;',
                              'code': '$("p").filter([".selected", ":first"])',
                              'result': '$("p").filter([".selected", ":first"]) == [ &lt;p&gt;Hello&lt;/p&gt;, &lt;p class="selected"&gt;And Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'filter',
            'params': [
                          {
                            'desc': 'A set of expressions to evaluate against',
                            'name': 'exprs',
                            'type': 'Array&lt;String&gt;'
                          }
                        ],
            'short': 'Removes all elements from the set of matched elements that do not match at least one of the expressions passed to the function.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes the specified Element from the set of matched elements. This method is used to remove a single Element from a jQuery object.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p id="selected"&gt;Hello Again&lt;/p&gt;',
                              'code': '$("p").not( document.getElementById("selected") )',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'not',
            'params': [
                          {
                            'desc': 'An element to remove from the set',
                            'name': 'el',
                            'type': 'Element'
                          }
                        ],
            'short': 'Removes the specified Element from the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes elements matching the specified expression from the set of matched elements. This method is used to remove one or more elements from a jQuery object.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p id="selected"&gt;Hello Again&lt;/p&gt;',
                              'code': '$("p").not("#selected")',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'not',
            'params': [
                          {
                            'desc': 'An expression with which to remove matching elements',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Removes elements matching the specified expression from the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Adds the elements matched by the expression to the jQuery object. This can be used to concatenate the result sets of two expressions.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/p&gt;',
                              'code': '$("p").add("span")',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt;, &lt;span&gt;Hello Again&lt;/span&gt; ]'
                            }
                          ],
            'name': 'add',
            'params': [
                          {
                            'desc': 'An expression whose matched elements are added',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Adds the elements matched by the expression to the jQuery object.',
            'type': 'jQuery'
          },
          {
            'desc': 'Adds each of the Elements in the array to the set of matched elements. This is used to add a set of Elements to a jQuery object.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;&lt;span id="a"&gt;Hello Again&lt;/span&gt;&lt;span id="b"&gt;And Again&lt;/span&gt;&lt;/p&gt;',
                              'code': '$("p").add([document.getElementById("a"), document.getElementById("b")])',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt;, &lt;span id="a"&gt;Hello Again&lt;/span&gt;, &lt;span id="b"&gt;And Again&lt;/span&gt; ]'
                            }
                          ],
            'name': 'add',
            'params': [
                          {
                            'desc': 'An array of Elements to add',
                            'name': 'els',
                            'type': 'Array&lt;Element&gt;'
                          }
                        ],
            'short': 'Adds each of the Elements in the array to the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Adds a single Element to the set of matched elements. This is used to add a single Element to a jQuery object.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;&lt;span id="a"&gt;Hello Again&lt;/span&gt;&lt;/p&gt;',
                              'code': '$("p").add( document.getElementById("a") )',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt;, &lt;span id="a"&gt;Hello Again&lt;/span&gt; ]'
                            }
                          ],
            'name': 'add',
            'params': [
                          {
                            'desc': 'An Element to add',
                            'name': 'el',
                            'type': 'Element'
                          }
                        ],
            'short': 'Adds a single Element to the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': '',
            'examples': [],
            'name': 'domManip',
            'params': [
                          {
                            'desc': '',
                            'name': 'args',
                            'type': 'Array'
                          },
                          {
                            'desc': '',
                            'name': 'table',
                            'type': 'Boolean'
                          },
                          {
                            'desc': '',
                            'name': 'int',
                            'type': 'Number'
                          },
                          {
                            'desc': 'The function doing the DOM manipulation.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'private': 1,
            'short': '',
            'type': 'jQuery'
          },
          {
            'desc': '',
            'examples': [],
            'name': 'pushStack',
            'params': [
                          {
                            'desc': '',
                            'name': 'a',
                            'type': 'Array'
                          },
                          {
                            'desc': '',
                            'name': 'args',
                            'type': 'Array'
                          }
                        ],
            'private': 1,
            'short': '',
            'type': 'jQuery'
          },
          {
            'desc': '',
            'examples': [],
            'name': 'extend',
            'params': [
                          {
                            'desc': '',
                            'name': 'obj',
                            'type': 'Object'
                          },
                          {
                            'desc': '',
                            'name': 'prop',
                            'type': 'Object'
                          }
                        ],
            'private': 1,
            'short': '',
            'type': 'Object'
          },
          {
            'desc': 'Extend one object with another, returning the original, modified, object. This is a great utility for simple inheritance.',
            'examples': [],
            'name': '$.extend',
            'params': [
                          {
                            'desc': 'The object to extend',
                            'name': 'obj',
                            'type': 'Object'
                          },
                          {
                            'desc': 'The object that will be merged into the first.',
                            'name': 'prop',
                            'type': 'Object'
                          }
                        ],
            'short': 'Extend one object with another, returning the original, modified, object.',
            'type': 'Object'
          },
          {
            'desc': '',
            'examples': [],
            'name': 'init',
            'params': [],
            'private': 1,
            'short': '',
            'type': 'undefined'
          },
          {
            'desc': 'A generic iterator function, which can be used to seemlessly iterate over both objects and arrays.',
            'examples': [],
            'name': '$.each',
            'params': [
                          {
                            'desc': 'The object, or array, to iterate over.',
                            'name': 'obj',
                            'type': 'Object'
                          },
                          {
                            'desc': 'The function that will be executed on every object.',
                            'name': 'fn',
                            'type': 'Object'
                          }
                        ],
            'short': 'A generic iterator function, which can be used to seemlessly iterate over both objects and arrays.',
            'type': 'Object'
          },
          {
            'desc': 'Remove the whitespace from the beginning and end of a string.',
            'examples': [],
            'name': '$.trim',
            'params': [
                          {
                            'desc': 'The string to trim.',
                            'name': 'str',
                            'type': 'String'
                          }
                        ],
            'private': 1,
            'short': 'Remove the whitespace from the beginning and end of a string.',
            'type': 'String'
          },
          {
            'desc': 'All ancestors of a given element.',
            'examples': [],
            'name': '$.parents',
            'params': [
                          {
                            'desc': 'The element to find the ancestors of.',
                            'name': 'elem',
                            'type': 'Element'
                          }
                        ],
            'private': 1,
            'short': 'All ancestors of a given element.',
            'type': 'Array&lt;Element&gt;'
          },
          {
            'desc': 'All elements on a specified axis.',
            'examples': [],
            'name': '$.sibling',
            'params': [
                          {
                            'desc': 'The element to find all the siblings of (including itself).',
                            'name': 'elem',
                            'type': 'Element'
                          }
                        ],
            'private': 1,
            'short': 'All elements on a specified axis.',
            'type': 'Array'
          },
          {
            'desc': 'Merge two arrays together, removing all duplicates.',
            'examples': [],
            'name': '$.merge',
            'params': [
                          {
                            'desc': 'The first array to merge.',
                            'name': 'a',
                            'type': 'Array'
                          },
                          {
                            'desc': 'The second array to merge.',
                            'name': 'b',
                            'type': 'Array'
                          }
                        ],
            'private': 1,
            'short': 'Merge two arrays together, removing all duplicates.',
            'type': 'Array'
          },
          {
            'desc': 'Remove items that aren\'t matched in an array. The function passed in to this method will be passed two arguments: \'a\' (which is the array item) and \'i\' (which is the index of the item in the array).',
            'examples': [],
            'name': '$.grep',
            'params': [
                          {
                            'desc': 'The Array to find items in.',
                            'name': 'array',
                            'type': 'Array'
                          },
                          {
                            'desc': 'The function to process each item against.',
                            'name': 'fn',
                            'type': 'Function'
                          },
                          {
                            'desc': 'Invert the selection - select the opposite of the function.',
                            'name': 'inv',
                            'type': 'Boolean'
                          }
                        ],
            'private': 1,
            'short': 'Remove items that aren\'t matched in an array.',
            'type': 'Array'
          },
          {
            'desc': 'Translate all items in array to another array of items. The translation function that is provided to this method is passed one argument: \'a\' (the item to be  translated). If an array is returned, that array is mapped out and merged into the full array. Additionally, returning \'null\' or \'undefined\' will delete the item from the array. Both of these changes imply that the size of the array may not be the same size upon completion, as it was when it started.',
            'examples': [],
            'name': '$.map',
            'params': [
                          {
                            'desc': 'The Array to translate.',
                            'name': 'array',
                            'type': 'Array'
                          },
                          {
                            'desc': 'The function to process each item against.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'private': 1,
            'short': 'Translate all items in array to another array of items.',
            'type': 'Array'
          },
          {
            'desc': 'Append all of the matched elements to another, specified, set of elements. This operation is, essentially, the reverse of doing a regular $(A).append(B), in that instead of appending B to A, you\'re appending A to B.',
            'examples': [
                            {
                              'before': '&lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;&lt;/div&gt;',
                              'code': '$("p").appendTo("#foo");',
                              'result': '&lt;div id="foo"&gt;&lt;p&gt;I would like to say: &lt;/p&gt;&lt;/div&gt;'
                            }
                          ],
            'name': 'appendTo',
            'params': [
                          {
                            'desc': 'A jQuery expression of elements to match.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Append all of the matched elements to another, specified, set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Prepend all of the matched elements to another, specified, set of elements. This operation is, essentially, the reverse of doing a regular $(A).prepend(B), in that instead of prepending B to A, you\'re prepending A to B.',
            'examples': [
                            {
                              'before': '&lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;&lt;b&gt;Hello&lt;/b&gt;&lt;/div&gt;',
                              'code': '$("p").prependTo("#foo");',
                              'result': '&lt;div id="foo"&gt;&lt;p&gt;I would like to say: &lt;/p&gt;&lt;b&gt;Hello&lt;/b&gt;&lt;/div&gt;'
                            }
                          ],
            'name': 'prependTo',
            'params': [
                          {
                            'desc': 'A jQuery expression of elements to match.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Prepend all of the matched elements to another, specified, set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Insert all of the matched elements before another, specified, set of elements. This operation is, essentially, the reverse of doing a regular $(A).before(B), in that instead of inserting B before A, you\'re inserting A before B.',
            'examples': [
                            {
                              'before': '&lt;div id="foo"&gt;Hello&lt;/div&gt;&lt;p&gt;I would like to say: &lt;/p&gt;',
                              'code': '$("p").insertBefore("#foo");',
                              'result': '&lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;Hello&lt;/div&gt;'
                            }
                          ],
            'name': 'insertBefore',
            'params': [
                          {
                            'desc': 'A jQuery expression of elements to match.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Insert all of the matched elements before another, specified, set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Insert all of the matched elements after another, specified, set of elements. This operation is, essentially, the reverse of doing a regular $(A).after(B), in that instead of inserting B after A, you\'re inserting A after B.',
            'examples': [
                            {
                              'before': '&lt;p&gt;I would like to say: &lt;/p&gt;&lt;div id="foo"&gt;Hello&lt;/div&gt;',
                              'code': '$("p").insertAfter("#foo");',
                              'result': '&lt;div id="foo"&gt;Hello&lt;/div&gt;&lt;p&gt;I would like to say: &lt;/p&gt;'
                            }
                          ],
            'name': 'insertAfter',
            'params': [
                          {
                            'desc': 'A jQuery expression of elements to match.',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Insert all of the matched elements after another, specified, set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS width of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").width();',
                              'result': '"300px"'
                            }
                          ],
            'name': 'width',
            'params': [],
            'short': 'Get the current CSS width of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS width of every matched element. Be sure to include the "px" (or other unit of measurement) after the number that you  specify, otherwise you might get strange results.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").width("20px");',
                              'result': '&lt;p style="width:20px;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'width',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS width of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS height of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").height();',
                              'result': '"14px"'
                            }
                          ],
            'name': 'height',
            'params': [],
            'short': 'Get the current CSS height of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS height of every matched element. Be sure to include the "px" (or other unit of measurement) after the number that you  specify, otherwise you might get strange results.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").height("20px");',
                              'result': '&lt;p style="height:20px;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'height',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS height of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS top of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").top();',
                              'result': '"0px"'
                            }
                          ],
            'name': 'top',
            'params': [],
            'short': 'Get the current CSS top of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS top of every matched element. Be sure to include the "px" (or other unit of measurement) after the number that you  specify, otherwise you might get strange results.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").top("20px");',
                              'result': '&lt;p style="top:20px;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'top',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS top of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS left of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").left();',
                              'result': '"0px"'
                            }
                          ],
            'name': 'left',
            'params': [],
            'short': 'Get the current CSS left of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS left of every matched element. Be sure to include the "px" (or other unit of measurement) after the number that you  specify, otherwise you might get strange results.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").left("20px");',
                              'result': '&lt;p style="left:20px;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'left',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS left of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS position of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").position();',
                              'result': '"static"'
                            }
                          ],
            'name': 'position',
            'params': [],
            'short': 'Get the current CSS position of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS position of every matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").position("relative");',
                              'result': '&lt;p style="position:relative;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'position',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS position of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS float of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").float();',
                              'result': '"none"'
                            }
                          ],
            'name': 'float',
            'params': [],
            'short': 'Get the current CSS float of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS float of every matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").float("left");',
                              'result': '&lt;p style="float:left;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'float',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS float of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS overflow of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").overflow();',
                              'result': '"none"'
                            }
                          ],
            'name': 'overflow',
            'params': [],
            'short': 'Get the current CSS overflow of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS overflow of every matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").overflow("auto");',
                              'result': '&lt;p style="overflow:auto;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'overflow',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS overflow of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS color of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").color();',
                              'result': '"black"'
                            }
                          ],
            'name': 'color',
            'params': [],
            'short': 'Get the current CSS color of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS color of every matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").color("blue");',
                              'result': '&lt;p style="color:blue;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'color',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS color of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current CSS background of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").background();',
                              'result': '""'
                            }
                          ],
            'name': 'background',
            'params': [],
            'short': 'Get the current CSS background of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the CSS background of every matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;This is just a test.&lt;/p&gt;',
                              'code': '$("p").background("blue");',
                              'result': '&lt;p style="background:blue;"&gt;This is just a test.&lt;/p&gt;'
                            }
                          ],
            'name': 'background',
            'params': [
                          {
                            'desc': 'Set the CSS property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the CSS background of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current value of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" value="some text"/&gt;',
                              'code': '$("input").val();',
                              'result': '"some text"'
                            }
                          ],
            'name': 'val',
            'params': [],
            'short': 'Get the current value of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the value of every matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" value="some text"/&gt;',
                              'code': '$("input").value("test");',
                              'result': '&lt;input type="text" value="test"/&gt;'
                            }
                          ],
            'name': 'val',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the value of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the html contents of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;input/&gt;&lt;/div&gt;',
                              'code': '$("div").html();',
                              'result': '&lt;input/&gt;'
                            }
                          ],
            'name': 'html',
            'params': [],
            'short': 'Get the html contents of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the html contents of every matched element.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;input/&gt;&lt;/div&gt;',
                              'code': '$("div").html("&lt;b&gt;new stuff&lt;/b&gt;");',
                              'result': '&lt;div&gt;&lt;b&gt;new stuff&lt;/b&lt;/div&gt;'
                            }
                          ],
            'name': 'html',
            'params': [
                          {
                            'desc': 'Set the html contents to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the html contents of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current id of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" id="test" value="some text"/&gt;',
                              'code': '$("input").id();',
                              'result': '"test"'
                            }
                          ],
            'name': 'id',
            'params': [],
            'short': 'Get the current id of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the id of every matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" id="test" value="some text"/&gt;',
                              'code': '$("input").id("newid");',
                              'result': '&lt;input type="text" id="newid" value="some text"/&gt;'
                            }
                          ],
            'name': 'id',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the id of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current title of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;img src="test.jpg" title="my image"/&gt;',
                              'code': '$("img").title();',
                              'result': '"my image"'
                            }
                          ],
            'name': 'title',
            'params': [],
            'short': 'Get the current title of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the title of every matched element.',
            'examples': [
                            {
                              'before': '&lt;img src="test.jpg" title="my image"/&gt;',
                              'code': '$("img").title("new title");',
                              'result': '&lt;img src="test.jpg" title="new image"/&gt;'
                            }
                          ],
            'name': 'title',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the title of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current name of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" name="username"/&gt;',
                              'code': '$("input").name();',
                              'result': '"username"'
                            }
                          ],
            'name': 'name',
            'params': [],
            'short': 'Get the current name of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the name of every matched element.',
            'examples': [
                            {
                              'before': '&lt;input type="text" name="username"/&gt;',
                              'code': '$("input").name("user");',
                              'result': '&lt;input type="text" name="user"/&gt;'
                            }
                          ],
            'name': 'name',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the name of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current href of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;a href="test.html"&gt;my link&lt;/a&gt;',
                              'code': '$("a").href();',
                              'result': '"test.html"'
                            }
                          ],
            'name': 'href',
            'params': [],
            'short': 'Get the current href of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the href of every matched element.',
            'examples': [
                            {
                              'before': '&lt;a href="test.html"&gt;my link&lt;/a&gt;',
                              'code': '$("a").href("test2.html");',
                              'result': '&lt;a href="test2.html"&gt;my link&lt;/a&gt;'
                            }
                          ],
            'name': 'href',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the href of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current src of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;img src="test.jpg" title="my image"/&gt;',
                              'code': '$("img").src();',
                              'result': '"test.jpg"'
                            }
                          ],
            'name': 'src',
            'params': [],
            'short': 'Get the current src of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the src of every matched element.',
            'examples': [
                            {
                              'before': '&lt;img src="test.jpg" title="my image"/&gt;',
                              'code': '$("img").src("test2.jpg");',
                              'result': '&lt;img src="test2.jpg" title="my image"/&gt;'
                            }
                          ],
            'name': 'src',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the src of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get the current rel of the first matched element.',
            'examples': [
                            {
                              'before': '&lt;a href="test.html" rel="nofollow"&gt;my link&lt;/a&gt;',
                              'code': '$("a").rel();',
                              'result': '"nofollow"'
                            }
                          ],
            'name': 'rel',
            'params': [],
            'short': 'Get the current rel of the first matched element.',
            'type': 'String'
          },
          {
            'desc': 'Set the rel of every matched element.',
            'examples': [
                            {
                              'before': '&lt;a href="test.html"&gt;my link&lt;/a&gt;',
                              'code': '$("a").rel("nofollow");',
                              'result': '&lt;a href="test.html" rel="nofollow"&gt;my link&lt;/a&gt;'
                            }
                          ],
            'name': 'rel',
            'params': [
                          {
                            'desc': 'Set the property to the specified value.',
                            'name': 'val',
                            'type': 'String'
                          }
                        ],
            'short': 'Set the rel of every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique parents of the matched set of elements.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;',
                              'code': '$("p").parent()',
                              'result': '[ &lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt; ]'
                            }
                          ],
            'name': 'parent',
            'params': [],
            'short': 'Get a set of elements containing the unique parents of the matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique parents of the matched set of elements, and filtered by an expression.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/div&gt;&lt;div class="selected"&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;/div&gt;',
                              'code': '$("p").parent(".selected")',
                              'result': '[ &lt;div class="selected"&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;/div&gt; ]'
                            }
                          ],
            'name': 'parent',
            'params': [
                          {
                            'desc': 'An expression to filter the parents with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing the unique parents of the matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique ancestors of the matched set of elements.',
            'examples': [
                            {
                              'before': '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;',
                              'code': '$("span").ancestors()',
                              'result': '[ &lt;body&gt;...&lt;/body&gt;, &lt;div&gt;...&lt;/div&gt;, &lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt; ]'
                            }
                          ],
            'name': 'ancestors',
            'params': [],
            'short': 'Get a set of elements containing the unique ancestors of the matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique ancestors of the matched set of elements, and filtered by an expression.',
            'examples': [
                            {
                              'before': '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;',
                              'code': '$("span").ancestors("p")',
                              'result': '[ &lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt; ]'
                            }
                          ],
            'name': 'ancestors',
            'params': [
                          {
                            'desc': 'An expression to filter the ancestors with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing the unique ancestors of the matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique ancestors of the matched set of elements.',
            'examples': [
                            {
                              'before': '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;',
                              'code': '$("span").ancestors()',
                              'result': '[ &lt;body&gt;...&lt;/body&gt;, &lt;div&gt;...&lt;/div&gt;, &lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt; ]'
                            }
                          ],
            'name': 'parents',
            'params': [],
            'short': 'Get a set of elements containing the unique ancestors of the matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique ancestors of the matched set of elements, and filtered by an expression.',
            'examples': [
                            {
                              'before': '&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;',
                              'code': '$("span").ancestors("p")',
                              'result': '[ &lt;p&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/p&gt; ]'
                            }
                          ],
            'name': 'parents',
            'params': [
                          {
                            'desc': 'An expression to filter the ancestors with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing the unique ancestors of the matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique next siblings of each of the  matched set of elements.<br><br>It only returns the very next sibling, not all next siblings.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;',
                              'code': '$("p").next()',
                              'result': '[ &lt;p&gt;Hello Again&lt;/p&gt;, &lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt; ]'
                            }
                          ],
            'name': 'next',
            'params': [],
            'short': 'Get a set of elements containing the unique next siblings of each of the  matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique next siblings of each of the  matched set of elements, and filtered by an expression.<br><br>It only returns the very next sibling, not all next siblings.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;div&gt;&lt;span&gt;And Again&lt;/span&gt;&lt;/div&gt;',
                              'code': '$("p").next(".selected")',
                              'result': '[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'next',
            'params': [
                          {
                            'desc': 'An expression to filter the next Elements with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing the unique next siblings of each of the  matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique previous siblings of each of the  matched set of elements.<br><br>It only returns the immediately previous sibling, not all previous siblings.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;',
                              'code': '$("p").previous()',
                              'result': '[ &lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt; ]'
                            }
                          ],
            'name': 'prev',
            'params': [],
            'short': 'Get a set of elements containing the unique previous siblings of each of the  matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing the unique previous siblings of each of the  matched set of elements, and filtered by an expression.<br><br>It only returns the immediately previous sibling, not all previous siblings.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;',
                              'code': '$("p").previous(".selected")',
                              'result': '[ &lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt; ]'
                            }
                          ],
            'name': 'prev',
            'params': [
                          {
                            'desc': 'An expression to filter the previous Elements with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing the unique previous siblings of each of the  matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;',
                              'code': '$("div").siblings()',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt;, &lt;p&gt;And Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'siblings',
            'params': [],
            'short': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements, and filtered by an expression.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;/div&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;',
                              'code': '$("div").siblings(".selected")',
                              'result': '[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'siblings',
            'params': [
                          {
                            'desc': 'An expression to filter the sibling Elements with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing all of the unique children of each of the  matched set of elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;div&gt;&lt;span&gt;Hello Again&lt;/span&gt;&lt;/div&gt;&lt;p&gt;And Again&lt;/p&gt;',
                              'code': '$("div").children()',
                              'result': '[ &lt;span&gt;Hello Again&lt;/span&gt; ]'
                            }
                          ],
            'name': 'children',
            'params': [],
            'short': 'Get a set of elements containing all of the unique children of each of the  matched set of elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements, and filtered by an expression.',
            'examples': [
                            {
                              'before': '&lt;div&gt;&lt;span&gt;Hello&lt;/span&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;&lt;p&gt;And Again&lt;/p&gt;&lt;/div&gt;',
                              'code': '$("div").children(".selected")',
                              'result': '[ &lt;p class="selected"&gt;Hello Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'children',
            'params': [
                          {
                            'desc': 'An expression to filter the child Elements with',
                            'name': 'expr',
                            'type': 'String'
                          }
                        ],
            'short': 'Get a set of elements containing all of the unique siblings of each of the  matched set of elements, and filtered by an expression.',
            'type': 'jQuery'
          },
          {
            'desc': 'Displays each of the set of matched elements if they are hidden.',
            'examples': [
                            {
                              'before': '&lt;p style="display: none"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").show()',
                              'result': '[ &lt;p style="display: block"&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'show',
            'params': [],
            'short': 'Displays each of the set of matched elements if they are hidden.',
            'type': 'jQuery'
          },
          {
            'desc': 'Hides each of the set of matched elements if they are shown.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").hide()',
                              'result': '[ &lt;p style="display: none"&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'hide',
            'params': [],
            'short': 'Hides each of the set of matched elements if they are shown.',
            'type': 'jQuery'
          },
          {
            'desc': 'Toggles each of the set of matched elements. If they are shown, toggle makes them hidden. If they are hidden, toggle makes them shown.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p style="display: none"&gt;Hello Again&lt;/p&gt;',
                              'code': '$("p").toggle()',
                              'result': '[ &lt;p style="display: none"&gt;Hello&lt;/p&gt;, &lt;p style="display: block"&gt;Hello Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'toggle',
            'params': [],
            'short': 'Toggles each of the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Adds the specified class to each of the set of matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '("p").addClass("selected")',
                              'result': '[ &lt;p class="selected"&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'addClass',
            'params': [
                          {
                            'desc': 'A CSS class to add to the elements',
                            'name': 'class',
                            'type': 'String'
                          }
                        ],
            'short': 'Adds the specified class to each of the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'The opposite of addClass. Removes the specified class from the set of matched elements.',
            'examples': [
                            {
                              'before': '&lt;p class="selected"&gt;Hello&lt;/p&gt;',
                              'code': '("p").removeClass("selected")',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'removeClass',
            'params': [
                          {
                            'desc': 'A CSS class to remove from the elements',
                            'name': 'class',
                            'type': 'String'
                          }
                        ],
            'short': 'The opposite of addClass.',
            'type': 'jQuery'
          },
          {
            'desc': 'Adds the specified class if it is present. Remove it if it is not present.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;&lt;p class="selected"&gt;Hello Again&lt;/p&gt;',
                              'code': '("p").toggleClass("selected")',
                              'result': '[ &lt;p class="selected"&gt;Hello&lt;/p&gt;, &lt;p&gt;Hello Again&lt;/p&gt; ]'
                            }
                          ],
            'name': 'toggleClass',
            'params': [
                          {
                            'desc': 'A CSS class with which to toggle the elements',
                            'name': 'class',
                            'type': 'String'
                          }
                        ],
            'short': 'Adds the specified class if it is present.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all child nodes from the set of matched elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello, &lt;span&gt;Person&lt;/span&gt; &lt;a href="#"&gt;and person&lt;/a&gt;&lt;/p&gt;',
                              'code': '("p").empty()',
                              'result': '[ &lt;p&gt;&lt;/p&gt; ]'
                            }
                          ],
            'name': 'empty',
            'params': [],
            'short': 'Removes all child nodes from the set of matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Binds a particular event (like click) to a each of a set of match elements.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").bind( "click", function() { alert("Hello"); } )',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]&nbsp;&nbsp;Cancel a default action and prevent it from bubbling by returning false<br>from your function.'
                            },
                            {
                              'code': '$("form").bind( "submit", function() { return false; } )&nbsp;&nbsp;Cancel a default action by using the preventDefault method.'
                            },
                            {
                              'code': '$("form").bind( "submit", function() { e.preventDefault(); } )&nbsp;&nbsp;Stop an event from bubbling by using the stopPropogation method.'
                            },
                            {
                              'code': '$("form").bind( "submit", function() { e.stopPropogation(); } )'
                            }
                          ],
            'name': 'bind',
            'params': [
                          {
                            'desc': 'An event type',
                            'name': 'type',
                            'type': 'String'
                          },
                          {
                            'desc': 'A function to bind to the event on each of the set of matched elements',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Binds a particular event (like click) to a each of a set of match elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'The opposite of bind, removes a bound event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unbind( "click", function() { alert("Hello"); } )',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'unbind',
            'params': [
                          {
                            'desc': 'An event type',
                            'name': 'type',
                            'type': 'String'
                          },
                          {
                            'desc': 'A function to unbind from the event on each of the set of matched elements',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'The opposite of bind, removes a bound event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound events of a particular type from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unbind( "click" )',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'unbind',
            'params': [
                          {
                            'desc': 'An event type',
                            'name': 'type',
                            'type': 'String'
                          }
                        ],
            'short': 'Removes all bound events of a particular type from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unbind()',
                              'result': '[ &lt;p&gt;Hello&lt;/p&gt; ]'
                            }
                          ],
            'name': 'unbind',
            'params': [],
            'short': 'Removes all bound events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger a type of event on every matched element.',
            'examples': [
                            {
                              'before': '&lt;p click="alert(\'hello\')"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").trigger("click")',
                              'result': 'alert(\'hello\')'
                            }
                          ],
            'name': 'trigger',
            'params': [
                          {
                            'desc': 'An event type to trigger.',
                            'name': 'type',
                            'type': 'String'
                          }
                        ],
            'short': 'Trigger a type of event on every matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Toggle between two function calls every other click. Whenever a matched element is clicked, the first specified function  is fired, when clicked again, the second is fired. All subsequent  clicks continue to rotate through the two functions.',
            'examples': [
                            {
                              'code': '$("p").toggle(function(){&nbsp;&nbsp;&nbsp;$(this).addClass("selected");<br>},function(){&nbsp;&nbsp;&nbsp;$(this).removeClass("selected");<br>});'
                            }
                          ],
            'name': 'toggle',
            'params': [
                          {
                            'desc': 'The function to execute on every even click.',
                            'name': 'even',
                            'type': 'Function'
                          },
                          {
                            'desc': 'The function to execute on every odd click.',
                            'name': 'odd',
                            'type': 'Function'
                          }
                        ],
            'short': 'Toggle between two function calls every other click.',
            'type': 'jQuery'
          },
          {
            'desc': 'A method for simulating hovering (moving the mouse on, and off, an object). This is a custom method which provides an \'in\' to a  frequent task.<br><br>Whenever the mouse cursor is moved over a matched  element, the first specified function is fired. Whenever the mouse  moves off of the element, the second specified function fires.  Additionally, checks are in place to see if the mouse is still within  the specified element itself (for example, an image inside of a div),  and if it is, it will continue to \'hover\', and not move out  (a common error in using a mouseout event handler).',
            'examples': [
                            {
                              'code': '$("p").hover(function(){&nbsp;&nbsp;&nbsp;$(this).addClass("over");<br>},function(){&nbsp;&nbsp;&nbsp;$(this).addClass("out");<br>});'
                            }
                          ],
            'name': 'hover',
            'params': [
                          {
                            'desc': 'The function to fire whenever the mouse is moved over a matched element.',
                            'name': 'over',
                            'type': 'Function'
                          },
                          {
                            'desc': 'The function to fire whenever the mouse is moved off of a matched element.',
                            'name': 'out',
                            'type': 'Function'
                          }
                        ],
            'short': 'A method for simulating hovering (moving the mouse on, and off, an object).',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to be executed whenever the DOM is ready to be traversed and manipulated. This is probably the most important  function included in the event module, as it can greatly improve the response times of your web applications.<br><br>In a nutshell, this is a solid replacement for using window.onload,  and attaching a function to that. By using this method, your bound Function  will be called the instant the DOM is ready to be read and manipulated,  which is exactly what 99.99% of all Javascript code needs to run.<br><br>Please ensure you have no code in your <body> onload event handler,  otherwise $(document).ready() may not fire.',
            'examples': [
                            {
                              'code': '$(document).ready(function(){ Your code here... });'
                            }
                          ],
            'name': 'ready',
            'params': [
                          {
                            'desc': 'The function to be executed when the DOM is ready.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to be executed whenever the DOM is ready to be traversed and manipulated.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the blur event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").blur( function() { alert("Hello"); } );',
                              'result': '&lt;p onblur="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'blur',
            'params': [
                          {
                            'desc': 'A function to bind to the blur event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the blur event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the blur event of each matched element. This causes all of the functions that have been bound to thet blur event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onblur="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").blur();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'blur',
            'params': [],
            'short': 'Trigger the blur event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the blur event of each matched element, which will only be executed once. Unlike a call to the normal .blur() method, calling .oneblur() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onblur="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneblur( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first blur'
                            }
                          ],
            'name': 'oneblur',
            'params': [
                          {
                            'desc': 'A function to bind to the blur event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the blur event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound blur event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onblur="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unblur( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unblur',
            'params': [
                          {
                            'desc': 'A function to unbind from the blur event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound blur event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound blur events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onblur="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unblur();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unblur',
            'params': [],
            'short': 'Removes all bound blur events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the focus event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").focus( function() { alert("Hello"); } );',
                              'result': '&lt;p onfocus="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'focus',
            'params': [
                          {
                            'desc': 'A function to bind to the focus event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the focus event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the focus event of each matched element. This causes all of the functions that have been bound to thet focus event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onfocus="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").focus();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'focus',
            'params': [],
            'short': 'Trigger the focus event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the focus event of each matched element, which will only be executed once. Unlike a call to the normal .focus() method, calling .onefocus() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onfocus="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onefocus( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first focus'
                            }
                          ],
            'name': 'onefocus',
            'params': [
                          {
                            'desc': 'A function to bind to the focus event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the focus event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound focus event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onfocus="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unfocus( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unfocus',
            'params': [
                          {
                            'desc': 'A function to unbind from the focus event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound focus event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound focus events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onfocus="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unfocus();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unfocus',
            'params': [],
            'short': 'Removes all bound focus events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the load event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").load( function() { alert("Hello"); } );',
                              'result': '&lt;p onload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'load',
            'params': [
                          {
                            'desc': 'A function to bind to the load event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the load event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the load event of each matched element. This causes all of the functions that have been bound to thet load event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").load();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'load',
            'params': [],
            'short': 'Trigger the load event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the load event of each matched element, which will only be executed once. Unlike a call to the normal .load() method, calling .oneload() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneload( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first load'
                            }
                          ],
            'name': 'oneload',
            'params': [
                          {
                            'desc': 'A function to bind to the load event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the load event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound load event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onload="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unload( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unload',
            'params': [
                          {
                            'desc': 'A function to unbind from the load event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound load event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound load events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unload();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unload',
            'params': [],
            'short': 'Removes all bound load events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the resize event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").resize( function() { alert("Hello"); } );',
                              'result': '&lt;p onresize="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'resize',
            'params': [
                          {
                            'desc': 'A function to bind to the resize event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the resize event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the resize event of each matched element. This causes all of the functions that have been bound to thet resize event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onresize="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").resize();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'resize',
            'params': [],
            'short': 'Trigger the resize event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the resize event of each matched element, which will only be executed once. Unlike a call to the normal .resize() method, calling .oneresize() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onresize="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneresize( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first resize'
                            }
                          ],
            'name': 'oneresize',
            'params': [
                          {
                            'desc': 'A function to bind to the resize event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the resize event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound resize event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onresize="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unresize( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unresize',
            'params': [
                          {
                            'desc': 'A function to unbind from the resize event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound resize event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound resize events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onresize="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unresize();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unresize',
            'params': [],
            'short': 'Removes all bound resize events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the scroll event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").scroll( function() { alert("Hello"); } );',
                              'result': '&lt;p onscroll="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'scroll',
            'params': [
                          {
                            'desc': 'A function to bind to the scroll event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the scroll event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the scroll event of each matched element. This causes all of the functions that have been bound to thet scroll event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onscroll="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").scroll();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'scroll',
            'params': [],
            'short': 'Trigger the scroll event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the scroll event of each matched element, which will only be executed once. Unlike a call to the normal .scroll() method, calling .onescroll() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onscroll="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onescroll( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first scroll'
                            }
                          ],
            'name': 'onescroll',
            'params': [
                          {
                            'desc': 'A function to bind to the scroll event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the scroll event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound scroll event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onscroll="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unscroll( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unscroll',
            'params': [
                          {
                            'desc': 'A function to unbind from the scroll event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound scroll event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound scroll events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onscroll="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unscroll();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unscroll',
            'params': [],
            'short': 'Removes all bound scroll events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the unload event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unload( function() { alert("Hello"); } );',
                              'result': '&lt;p onunload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unload',
            'params': [
                          {
                            'desc': 'A function to bind to the unload event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the unload event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the unload event of each matched element. This causes all of the functions that have been bound to thet unload event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onunload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unload();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'unload',
            'params': [],
            'short': 'Trigger the unload event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the unload event of each matched element, which will only be executed once. Unlike a call to the normal .unload() method, calling .oneunload() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onunload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneunload( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first unload'
                            }
                          ],
            'name': 'oneunload',
            'params': [
                          {
                            'desc': 'A function to bind to the unload event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the unload event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound unload event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onunload="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").ununload( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'ununload',
            'params': [
                          {
                            'desc': 'A function to unbind from the unload event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound unload event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound unload events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onunload="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").ununload();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'ununload',
            'params': [],
            'short': 'Removes all bound unload events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the click event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").click( function() { alert("Hello"); } );',
                              'result': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'click',
            'params': [
                          {
                            'desc': 'A function to bind to the click event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the click event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the click event of each matched element. This causes all of the functions that have been bound to thet click event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").click();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'click',
            'params': [],
            'short': 'Trigger the click event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the click event of each matched element, which will only be executed once. Unlike a call to the normal .click() method, calling .oneclick() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneclick( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first click'
                            }
                          ],
            'name': 'oneclick',
            'params': [
                          {
                            'desc': 'A function to bind to the click event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the click event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound click event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onclick="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unclick( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unclick',
            'params': [
                          {
                            'desc': 'A function to unbind from the click event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound click event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound click events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unclick();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unclick',
            'params': [],
            'short': 'Removes all bound click events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the dblclick event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").dblclick( function() { alert("Hello"); } );',
                              'result': '&lt;p ondblclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'dblclick',
            'params': [
                          {
                            'desc': 'A function to bind to the dblclick event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the dblclick event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the dblclick event of each matched element. This causes all of the functions that have been bound to thet dblclick event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p ondblclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").dblclick();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'dblclick',
            'params': [],
            'short': 'Trigger the dblclick event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the dblclick event of each matched element, which will only be executed once. Unlike a call to the normal .dblclick() method, calling .onedblclick() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p ondblclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onedblclick( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first dblclick'
                            }
                          ],
            'name': 'onedblclick',
            'params': [
                          {
                            'desc': 'A function to bind to the dblclick event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the dblclick event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound dblclick event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p ondblclick="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").undblclick( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'undblclick',
            'params': [
                          {
                            'desc': 'A function to unbind from the dblclick event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound dblclick event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound dblclick events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p ondblclick="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").undblclick();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'undblclick',
            'params': [],
            'short': 'Removes all bound dblclick events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mousedown event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mousedown( function() { alert("Hello"); } );',
                              'result': '&lt;p onmousedown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'mousedown',
            'params': [
                          {
                            'desc': 'A function to bind to the mousedown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mousedown event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the mousedown event of each matched element. This causes all of the functions that have been bound to thet mousedown event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onmousedown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mousedown();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'mousedown',
            'params': [],
            'short': 'Trigger the mousedown event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mousedown event of each matched element, which will only be executed once. Unlike a call to the normal .mousedown() method, calling .onemousedown() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onmousedown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onemousedown( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first mousedown'
                            }
                          ],
            'name': 'onemousedown',
            'params': [
                          {
                            'desc': 'A function to bind to the mousedown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mousedown event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound mousedown event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onmousedown="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmousedown( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmousedown',
            'params': [
                          {
                            'desc': 'A function to unbind from the mousedown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound mousedown event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound mousedown events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onmousedown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmousedown();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmousedown',
            'params': [],
            'short': 'Removes all bound mousedown events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseup event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseup( function() { alert("Hello"); } );',
                              'result': '&lt;p onmouseup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'mouseup',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseup event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the mouseup event of each matched element. This causes all of the functions that have been bound to thet mouseup event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onmouseup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseup();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'mouseup',
            'params': [],
            'short': 'Trigger the mouseup event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseup event of each matched element, which will only be executed once. Unlike a call to the normal .mouseup() method, calling .onemouseup() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onmouseup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onemouseup( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first mouseup'
                            }
                          ],
            'name': 'onemouseup',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseup event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound mouseup event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onmouseup="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseup( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseup',
            'params': [
                          {
                            'desc': 'A function to unbind from the mouseup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound mouseup event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound mouseup events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onmouseup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseup();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseup',
            'params': [],
            'short': 'Removes all bound mouseup events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mousemove event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mousemove( function() { alert("Hello"); } );',
                              'result': '&lt;p onmousemove="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'mousemove',
            'params': [
                          {
                            'desc': 'A function to bind to the mousemove event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mousemove event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the mousemove event of each matched element. This causes all of the functions that have been bound to thet mousemove event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onmousemove="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mousemove();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'mousemove',
            'params': [],
            'short': 'Trigger the mousemove event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mousemove event of each matched element, which will only be executed once. Unlike a call to the normal .mousemove() method, calling .onemousemove() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onmousemove="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onemousemove( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first mousemove'
                            }
                          ],
            'name': 'onemousemove',
            'params': [
                          {
                            'desc': 'A function to bind to the mousemove event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mousemove event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound mousemove event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onmousemove="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmousemove( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmousemove',
            'params': [
                          {
                            'desc': 'A function to unbind from the mousemove event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound mousemove event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound mousemove events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onmousemove="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmousemove();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmousemove',
            'params': [],
            'short': 'Removes all bound mousemove events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseover event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseover( function() { alert("Hello"); } );',
                              'result': '&lt;p onmouseover="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'mouseover',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseover event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseover event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the mouseover event of each matched element. This causes all of the functions that have been bound to thet mouseover event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onmouseover="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseover();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'mouseover',
            'params': [],
            'short': 'Trigger the mouseover event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseover event of each matched element, which will only be executed once. Unlike a call to the normal .mouseover() method, calling .onemouseover() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onmouseover="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onemouseover( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first mouseover'
                            }
                          ],
            'name': 'onemouseover',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseover event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseover event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound mouseover event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onmouseover="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseover( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseover',
            'params': [
                          {
                            'desc': 'A function to unbind from the mouseover event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound mouseover event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound mouseover events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onmouseover="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseover();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseover',
            'params': [],
            'short': 'Removes all bound mouseover events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseout event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseout( function() { alert("Hello"); } );',
                              'result': '&lt;p onmouseout="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'mouseout',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseout event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseout event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the mouseout event of each matched element. This causes all of the functions that have been bound to thet mouseout event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onmouseout="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").mouseout();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'mouseout',
            'params': [],
            'short': 'Trigger the mouseout event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the mouseout event of each matched element, which will only be executed once. Unlike a call to the normal .mouseout() method, calling .onemouseout() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onmouseout="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onemouseout( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first mouseout'
                            }
                          ],
            'name': 'onemouseout',
            'params': [
                          {
                            'desc': 'A function to bind to the mouseout event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the mouseout event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound mouseout event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onmouseout="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseout( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseout',
            'params': [
                          {
                            'desc': 'A function to unbind from the mouseout event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound mouseout event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound mouseout events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onmouseout="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unmouseout();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unmouseout',
            'params': [],
            'short': 'Removes all bound mouseout events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the change event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").change( function() { alert("Hello"); } );',
                              'result': '&lt;p onchange="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'change',
            'params': [
                          {
                            'desc': 'A function to bind to the change event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the change event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the change event of each matched element. This causes all of the functions that have been bound to thet change event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onchange="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").change();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'change',
            'params': [],
            'short': 'Trigger the change event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the change event of each matched element, which will only be executed once. Unlike a call to the normal .change() method, calling .onechange() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onchange="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onechange( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first change'
                            }
                          ],
            'name': 'onechange',
            'params': [
                          {
                            'desc': 'A function to bind to the change event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the change event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound change event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onchange="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unchange( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unchange',
            'params': [
                          {
                            'desc': 'A function to unbind from the change event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound change event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound change events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onchange="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unchange();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unchange',
            'params': [],
            'short': 'Removes all bound change events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the reset event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").reset( function() { alert("Hello"); } );',
                              'result': '&lt;p onreset="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'reset',
            'params': [
                          {
                            'desc': 'A function to bind to the reset event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the reset event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the reset event of each matched element. This causes all of the functions that have been bound to thet reset event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onreset="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").reset();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'reset',
            'params': [],
            'short': 'Trigger the reset event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the reset event of each matched element, which will only be executed once. Unlike a call to the normal .reset() method, calling .onereset() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onreset="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onereset( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first reset'
                            }
                          ],
            'name': 'onereset',
            'params': [
                          {
                            'desc': 'A function to bind to the reset event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the reset event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound reset event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onreset="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unreset( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unreset',
            'params': [
                          {
                            'desc': 'A function to unbind from the reset event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound reset event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound reset events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onreset="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unreset();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unreset',
            'params': [],
            'short': 'Removes all bound reset events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the select event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").select( function() { alert("Hello"); } );',
                              'result': '&lt;p onselect="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'select',
            'params': [
                          {
                            'desc': 'A function to bind to the select event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the select event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the select event of each matched element. This causes all of the functions that have been bound to thet select event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onselect="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").select();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'select',
            'params': [],
            'short': 'Trigger the select event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the select event of each matched element, which will only be executed once. Unlike a call to the normal .select() method, calling .oneselect() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onselect="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneselect( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first select'
                            }
                          ],
            'name': 'oneselect',
            'params': [
                          {
                            'desc': 'A function to bind to the select event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the select event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound select event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onselect="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unselect( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unselect',
            'params': [
                          {
                            'desc': 'A function to unbind from the select event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound select event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound select events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onselect="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unselect();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unselect',
            'params': [],
            'short': 'Removes all bound select events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the submit event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").submit( function() { alert("Hello"); } );',
                              'result': '&lt;p onsubmit="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'submit',
            'params': [
                          {
                            'desc': 'A function to bind to the submit event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the submit event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the submit event of each matched element. This causes all of the functions that have been bound to thet submit event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onsubmit="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").submit();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'submit',
            'params': [],
            'short': 'Trigger the submit event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the submit event of each matched element, which will only be executed once. Unlike a call to the normal .submit() method, calling .onesubmit() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onsubmit="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onesubmit( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first submit'
                            }
                          ],
            'name': 'onesubmit',
            'params': [
                          {
                            'desc': 'A function to bind to the submit event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the submit event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound submit event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onsubmit="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unsubmit( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unsubmit',
            'params': [
                          {
                            'desc': 'A function to unbind from the submit event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound submit event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound submit events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onsubmit="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unsubmit();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unsubmit',
            'params': [],
            'short': 'Removes all bound submit events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keydown event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keydown( function() { alert("Hello"); } );',
                              'result': '&lt;p onkeydown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'keydown',
            'params': [
                          {
                            'desc': 'A function to bind to the keydown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keydown event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the keydown event of each matched element. This causes all of the functions that have been bound to thet keydown event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onkeydown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keydown();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'keydown',
            'params': [],
            'short': 'Trigger the keydown event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keydown event of each matched element, which will only be executed once. Unlike a call to the normal .keydown() method, calling .onekeydown() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onkeydown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onekeydown( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first keydown'
                            }
                          ],
            'name': 'onekeydown',
            'params': [
                          {
                            'desc': 'A function to bind to the keydown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keydown event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound keydown event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onkeydown="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeydown( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeydown',
            'params': [
                          {
                            'desc': 'A function to unbind from the keydown event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound keydown event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound keydown events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onkeydown="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeydown();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeydown',
            'params': [],
            'short': 'Removes all bound keydown events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keypress event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keypress( function() { alert("Hello"); } );',
                              'result': '&lt;p onkeypress="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'keypress',
            'params': [
                          {
                            'desc': 'A function to bind to the keypress event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keypress event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the keypress event of each matched element. This causes all of the functions that have been bound to thet keypress event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onkeypress="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keypress();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'keypress',
            'params': [],
            'short': 'Trigger the keypress event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keypress event of each matched element, which will only be executed once. Unlike a call to the normal .keypress() method, calling .onekeypress() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onkeypress="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onekeypress( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first keypress'
                            }
                          ],
            'name': 'onekeypress',
            'params': [
                          {
                            'desc': 'A function to bind to the keypress event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keypress event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound keypress event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onkeypress="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeypress( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeypress',
            'params': [
                          {
                            'desc': 'A function to unbind from the keypress event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound keypress event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound keypress events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onkeypress="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeypress();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeypress',
            'params': [],
            'short': 'Removes all bound keypress events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keyup event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keyup( function() { alert("Hello"); } );',
                              'result': '&lt;p onkeyup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'keyup',
            'params': [
                          {
                            'desc': 'A function to bind to the keyup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keyup event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the keyup event of each matched element. This causes all of the functions that have been bound to thet keyup event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onkeyup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").keyup();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'keyup',
            'params': [],
            'short': 'Trigger the keyup event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the keyup event of each matched element, which will only be executed once. Unlike a call to the normal .keyup() method, calling .onekeyup() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onkeyup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").onekeyup( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first keyup'
                            }
                          ],
            'name': 'onekeyup',
            'params': [
                          {
                            'desc': 'A function to bind to the keyup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the keyup event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound keyup event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onkeyup="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeyup( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeyup',
            'params': [
                          {
                            'desc': 'A function to unbind from the keyup event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound keyup event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound keyup events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onkeyup="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unkeyup();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unkeyup',
            'params': [],
            'short': 'Removes all bound keyup events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the error event of each matched element.',
            'examples': [
                            {
                              'before': '&lt;p&gt;Hello&lt;/p&gt;',
                              'code': '$("p").error( function() { alert("Hello"); } );',
                              'result': '&lt;p onerror="alert(\'Hello\');"&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'error',
            'params': [
                          {
                            'desc': 'A function to bind to the error event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the error event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Trigger the error event of each matched element. This causes all of the functions that have been bound to thet error event to be executed.',
            'examples': [
                            {
                              'before': '&lt;p onerror="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").error();',
                              'result': 'alert(\'Hello\');'
                            }
                          ],
            'name': 'error',
            'params': [],
            'short': 'Trigger the error event of each matched element.',
            'type': 'jQuery'
          },
          {
            'desc': 'Bind a function to the error event of each matched element, which will only be executed once. Unlike a call to the normal .error() method, calling .oneerror() causes the bound function to be only executed the first time it is triggered, and never again (unless it is re-bound).',
            'examples': [
                            {
                              'before': '&lt;p onerror="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").oneerror( function() { alert("Hello"); } );',
                              'result': 'alert(\'Hello\'); // Only executed for the first error'
                            }
                          ],
            'name': 'oneerror',
            'params': [
                          {
                            'desc': 'A function to bind to the error event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Bind a function to the error event of each matched element, which will only be executed once.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes a bound error event from each of the matched elements. You must pass the identical function that was used in the original  bind method.',
            'examples': [
                            {
                              'before': '&lt;p onerror="myFunction"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unerror( myFunction );',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unerror',
            'params': [
                          {
                            'desc': 'A function to unbind from the error event on each of the matched elements.',
                            'name': 'fn',
                            'type': 'Function'
                          }
                        ],
            'short': 'Removes a bound error event from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Removes all bound error events from each of the matched elements.',
            'examples': [
                            {
                              'before': '&lt;p onerror="alert(\'Hello\');"&gt;Hello&lt;/p&gt;',
                              'code': '$("p").unerror();',
                              'result': '&lt;p&gt;Hello&lt;/p&gt;'
                            }
                          ],
            'name': 'unerror',
            'params': [],
            'short': 'Removes all bound error events from each of the matched elements.',
            'type': 'jQuery'
          },
          {
            'desc': 'Show all matched elements using a graceful animation. The height, width, and opacity of each of the matched elements  are changed dynamically according to the specified speed.',
            'examples': [
                            {
                              'code': '$("p").show("slow");'
                            }
                          ],
            'name': 'show',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Show all matched elements using a graceful animation.',
            'type': 'jQuery'
          },
          {
            'desc': 'Show all matched elements using a graceful animation and firing a callback function after completion. The height, width, and opacity of each of the matched elements  are changed dynamically according to the specified speed.',
            'examples': [
                            {
                              'code': '$("p").show("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'show',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Show all matched elements using a graceful animation and firing a callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Hide all matched elements using a graceful animation. The height, width, and opacity of each of the matched elements  are changed dynamically according to the specified speed.',
            'examples': [
                            {
                              'code': '$("p").hide("slow");'
                            }
                          ],
            'name': 'hide',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Hide all matched elements using a graceful animation.',
            'type': 'jQuery'
          },
          {
            'desc': 'Hide all matched elements using a graceful animation and firing a callback function after completion. The height, width, and opacity of each of the matched elements  are changed dynamically according to the specified speed.',
            'examples': [
                            {
                              'code': '$("p").hide("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'hide',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Hide all matched elements using a graceful animation and firing a callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Reveal all matched elements by adjusting their height. Only the height is adjusted for this animation, causing all matched elements to be revealed in a "sliding" manner.',
            'examples': [
                            {
                              'code': '$("p").slideDown("slow");'
                            }
                          ],
            'name': 'slideDown',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Reveal all matched elements by adjusting their height.',
            'type': 'jQuery'
          },
          {
            'desc': 'Reveal all matched elements by adjusting their height and firing a callback function after completion. Only the height is adjusted for this animation, causing all matched elements to be revealed in a "sliding" manner.',
            'examples': [
                            {
                              'code': '$("p").slideDown("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'slideDown',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Reveal all matched elements by adjusting their height and firing a callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Hide all matched elements by adjusting their height. Only the height is adjusted for this animation, causing all matched elements to be hidden in a "sliding" manner.',
            'examples': [
                            {
                              'code': '$("p").slideUp("slow");'
                            }
                          ],
            'name': 'slideUp',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Hide all matched elements by adjusting their height.',
            'type': 'jQuery'
          },
          {
            'desc': 'Hide all matched elements by adjusting their height and firing a callback function after completion. Only the height is adjusted for this animation, causing all matched elements to be hidden in a "sliding" manner.',
            'examples': [
                            {
                              'code': '$("p").slideUp("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'slideUp',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Hide all matched elements by adjusting their height and firing a callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade in all matched elements by adjusting their opacity. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeIn("slow");'
                            }
                          ],
            'name': 'fadeIn',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Fade in all matched elements by adjusting their opacity.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade in all matched elements by adjusting their opacity and firing a  callback function after completion. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeIn("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'fadeIn',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Fade in all matched elements by adjusting their opacity and firing a  callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade out all matched elements by adjusting their opacity. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeOut("slow");'
                            }
                          ],
            'name': 'fadeOut',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          }
                        ],
            'short': 'Fade out all matched elements by adjusting their opacity.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade out all matched elements by adjusting their opacity and firing a  callback function after completion. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeOut("slow",function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'fadeOut',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Fade out all matched elements by adjusting their opacity and firing a  callback function after completion.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade the opacity of all matched elements to a specified opacity. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeTo("slow", 0.5);'
                            }
                          ],
            'name': 'fadeTo',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'The opacity to fade to (a number from 0 to 1).',
                            'name': 'opacity',
                            'type': 'Number'
                          }
                        ],
            'short': 'Fade the opacity of all matched elements to a specified opacity.',
            'type': 'jQuery'
          },
          {
            'desc': 'Fade the opacity of all matched elements to a specified opacity and  firing a callback function after completion. Only the opacity is adjusted for this animation, meaning that all of the matched elements should already have some form of height and width associated with them.',
            'examples': [
                            {
                              'code': '$("p").fadeTo("slow", 0.5, function(){&nbsp;&nbsp;&nbsp;alert("Animation Done.");<br>});'
                            }
                          ],
            'name': 'fadeTo',
            'params': [
                          {
                            'desc': 'A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).',
                            'name': 'speed',
                            'type': 'Object'
                          },
                          {
                            'desc': 'The opacity to fade to (a number from 0 to 1).',
                            'name': 'opacity',
                            'type': 'Number'
                          },
                          {
                            'desc': 'A function to be executed whenever the animation completes.',
                            'name': 'callback',
                            'type': 'Function'
                          }
                        ],
            'short': 'Fade the opacity of all matched elements to a specified opacity and  firing a callback function after completion.',
            'type': 'jQuery'
          }
        ]
