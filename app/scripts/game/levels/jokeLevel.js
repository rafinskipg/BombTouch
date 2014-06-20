define( [ ], function(){
var stageStructure = {
  time_between_groups: 5,
  time_between_enemies:1,
  time_between_stages: 5,
  stages : [
    [
    [1],[1,1],[1,1,1],[1,1,1,1,1,1],[2]
    ],
    [
    [2],[2,1,2],[2,1,2,2],[2,2,2,2,3,3],[3,3,3]
    ],
    [
    [3,2],[3,3,2],[3,2,3,3],[4,4,5,4]
    ],
    [
    [4],[4,4],[4,3,4],[4,3,4,3,4,4,5,5], [4,5,5,5]
    ],
    [
    [5],[5,5],[5,5,4],[5,4,3,5,4,5,4,5]
    ]
  ]
}

return stageStructure;
});