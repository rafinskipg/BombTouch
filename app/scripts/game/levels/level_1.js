define( [ ], function(){
var stageStructure = {
  time_between_groups: 2,
  time_between_enemies:2,
  time_between_stages: 5,
  ambient_entities: ['tire', 'junk2', 'junk3', 'junk4','junk1','ship1', 'ship2','ship3'],
  stages : [

    {
      groups: [['rat'],['junk2','junk1'],['junk2','junk3','junk1'],
        ['junk2','junk3','junk1'],['rat','junk4','junk3'],
        ['junk2','junk3','junk1'],['junk4','junk2','junk3']
      ]
    },
    {
      groups: [
        ['rat','rat'],['junk1', 'rat','rat','rat'],['junk1', 'rat','rat','rat'],['junk1', 'drone','junk2','rat'],['junk2', 'rat','rat','rat'], ['junk3', 'rat','rat','rat']
        ]
    },
    {
      groups:[
        ['rat','drone'],['junk1', 'junk4','rat','rat'],['junk1', 'drone','rat','junk2'],['junk1', 'drone','rat','rat'],['junk2', 'rat','rat','rat'], ['junk3', 'rat','rat','rat']
        ]
    },
    {
      positioningMethod: 'vshape',
      time_between_enemies:3,
      time_between_groups: 5,
      groups: [
      ['ratship', 'ratship', 'ratship'],
      ['junk2','junk3','junk1'],
      ['ratship', 'ratship', 'ratship'],
      ['junk4']
      ]
    }
    
  ],
  boss:  'junkMutant', 
  setOfEntities: 'level_1'
}

return stageStructure;
});