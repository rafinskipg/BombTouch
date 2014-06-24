define( [ ], function(){
var stageStructure = {
  time_between_groups: 2,
  time_between_enemies:2,
  time_between_stages: 5,
  ambient_entities: ['junk1', 'junk2', 'junk3', 'junk4'],
  stages : [
    [
    ['junk4'],['junk2','junk1'],['junk2','junk3','junk1'],
      ['junk2','junk3','junk1'],['rat','junk4','junk3'],
      ['junk2','junk3','junk1'],['junk4','junk2','junk3']
    ],
    [
    ['rat','rat'],['junk1', 'rat','rat','rat'],['junk1', 'rat','rat','rat'],['junk1', 'drone','junk2','rat'],['junk2', 'rat','rat','rat'], ['junk3', 'rat','rat','rat']
    ],
    [
    ['rat','drone'],['junk1', 'junk4','rat','rat'],['junk1', 'drone','rat','junk2'],['junk1', 'drone','rat','rat'],['junk2', 'rat','rat','rat'], ['junk3', 'rat','rat','rat']
    ]
  ],
  boss:  'junkMutant', 
  setOfEntities: 'level_1'
}

return stageStructure;
});