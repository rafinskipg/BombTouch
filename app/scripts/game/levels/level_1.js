define( [ ], function(){
var stageStructure = {
  time_between_groups: 2,
  time_between_enemies:4,
  time_between_stages: 5,
  parallax: [
    //['images/backgrounds/parallax_1_junk.png', 'images/backgrounds/parallax_1_junk2.png', 'images/backgrounds/parallax_1_junk3.png', 'images/backgrounds/parallax_1_junk4.png'],
    //['images/backgrounds/parallax_1_junk.png', 'images/backgrounds/parallax_1_junk2.png', 'images/backgrounds/parallax_1_junk3.png', 'images/backgrounds/parallax_1_junk4.png']
    ['images/backgrounds/parallax_1_junk.png', 'images/backgrounds/parallax_1_junk2.png'],
    ['images/backgrounds/parallax_1_junk.png', 'images/backgrounds/parallax_1_junk2.png']
  ],
  ambient_entities: ['junk2', 'junk3', 'junk4','junk1'],
  stages : [

    {
      groups: [['unknown1'],['unknown1','unknown2'],['unknown3','unknown2','unknown1'],
        ['unknown1','unknown2','unknown3'],['rat'],
        ['unknown2','unknown3','unknown4', 'rat']
      ]
    },
    {
      groups: [
        ['rat','rat'],['unknown1', 'rat','rat','rat'],['rat','rat','rat'],['unknown2'], ['drone'],['rat', 'rat','drone','rat']
        ]
    },
    {
      groups:[
        ['rat','drone', 'drone', 'drone', 'unknown1', 'unknown3', 'rat'], ['ratship']
        ]
    },
    {
      positioningMethod: 'vshape',
      time_between_enemies:0.2,
      time_between_groups: 2,
      groups: [
      ['ratship', 'ratship', 'ratship'],
      ['ratship', 'ratship', 'ratship'],
      ]
    }
    
  ],
  boss:  'junkMutant', 
  setOfEntities: 'level_1'
}

return stageStructure;
});