define( [ ], function(){
var stageStructure = {
  time_between_groups: 2,
  time_between_enemies:1,
  time_between_stages: 5,
  stages : [
    [
    ['junk1'],['junk2','junk1'],['junk2','junk3','junk1'],
      ['junk2','junk3','junk1'],['rat','junk2','junk3']
    ],
    [
    ['rat','rat'],['junk1', 'rat','rat','rat'],['junk2', 'rat','rat','rat'], ['junk3', 'rat','rat','rat']
    ]
  ],
  boss:  'junkMutant', 
  setOfEntities: 'level_1'
}

return stageStructure;
});