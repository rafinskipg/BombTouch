define( [], function(){
  

  function Message(text, sender, duration){
    this.text = text;
    this.sender = sender;
    this.duration = duration || 2000;
  }

  return  {
    Message: Message
  };

});