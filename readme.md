# Absol-Diff

> Code compare

## Compare 2 string(word - word)

```js
import * as Diff from 'absol-diff';
var a = "absol-diff is a sub-project of absol project";
var b = "absol-diff is a sub-project of absol.js(tiny html5 framework)";
var result = Diff.diffSingleText(a, b);
var resultShoultBe = [ 
{ 
    "left":{ 
        "start":0,
        "end":36
    },
    "right":{ 
        "start":0,
        "end":36
    },
    "color":1//same
},
{ 
    "left":{ 
        "start":36,
        "end":36
    },
    "right":{ 
        "start":36,
        "end":44
    },
    "color":-1//diff
},
...
]

```

## Compare 2 code(line - line) 

```js
import * as Diff from 'absol-diff';
var a = `//QHD
for (var i = 0; i < lTokens.length; ++i) {
    for (var j = 0; j < rTokens.length; ++j) {
        Q[i + 1][j + 1] = Math.max(Q[i][j + 1], Q[i + 1][j]);
        if (lTokens[i].value == rTokens[j].value) {
            // different line 0
            Q[i + 1][j + 1] = Math.max(Q[i + 1][j + 1], Q[i][j] + rTokens[j].score);
        }
    }
}`;
var b = `//QHD - Dynamic Programming
for (var i = 0; i < lTokens.length; ++i) {
    for (var j = 0; j < rTokens.length; ++j) {
        //insert line
        Q[i + 1][j + 1] = Math.max(Q[i][j + 1], Q[i + 1][j]);
        if (lTokens[i].value == rTokens[j].value) {
        // different line 1
            Q[i + 1][j + 1] = Math.max(Q[i + 1][j + 1], Q[i][j] + rTokens[j].score);
        }
    }
}`;
var result = Diff.diffByLineText(a, b);
var resultShoultBe = { 
   "lLines":[ 
      "//QHD",
      "for (var i = 0; i < lTokens.length; ++i) {",
      ...
   ],
   "rLines":[ 
      "//QHD - Dynamic Programming",
      "for (var i = 0; i < lTokens.length; ++i) {",
     ...
   ],
   "trapeziumes":[ 
      { 
         "left":{ 
            "start":0,
            "end":1
         },
         "right":{ 
            "start":0,
            "end":1
         },
         "color":-1
      },
      { 
         "left":{ 
            "start":1,
            "end":3
         },
         "right":{ 
            "start":1,
            "end":3
         },
         "color":1
      },
     ...
   ]
}
```

## Work with web-worker

`diffworker.js`
```js
import IFrameBridge from 'absol/src/Network/IFrameBridge';

import * as Diff from 'absol-diff';

var brigde = IFrameBridge.getInstance();
brigde.diffByLine = function (leftData, rightData) {
    return Diff.diffByLineText(leftData, rightData);
}


brigde.diffByWord = function (leftData, rightData) {
    return Diff.diffSingleText(leftData, rightData);
}
```

`main.js`
```js
import IFrameBridge from 'absol/src/Network/IFrameBridge';
var diffWorker = new IFrameBridge(new Worker('./dist/diffworker.js'));
var leftData = self.editorLeft.getValue();
var rightData = self.editorRight.getValue();
diffWorker.invoke('diffByLine', leftData, rightData).then(function(result){
    //process result data
});
```