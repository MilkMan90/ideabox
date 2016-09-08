
var $ideaTitleInput = $('#idea-title-input');
var $ideaBodyInput = $('#idea-body-input');
var $form = $('#input-form');
var $ideaList = $('#idea-list');
var $search = $('#search-input');


function Idea(id, title, body) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function newUniqueID () {
  return Date.now();
}

function getUserTitle () {
  return $ideaTitleInput.val();
}

function getUserBody () {
  return $ideaBodyInput.val();
}


function ideaStringify(newIdea) {
  return JSON.stringify(newIdea);
}

function ideaToStorage(newIdea) {
  localStorage.setItem(newIdea.id, ideaStringify(newIdea));
  addIdToArray(newIdea.id);
}

function addIdToArray(id) {
  var IdeaIDArray = retrieveIDArray();

  IdeaIDArray.push(id);
  localStorage.setItem('idArray', JSON.stringify(IdeaIDArray));
}

function retrieveIdea(id) {
  return JSON.parse(localStorage.getItem(id));
}

function retrieveIDArray() {

  if (JSON.parse(localStorage.getItem('idArray')) === null){
    return [];
  } else{
    return JSON.parse(localStorage.getItem('idArray'));
  }
}

$form.submit( function(){
  event.preventDefault();
  var newIdea = new Idea(newUniqueID(), getUserTitle(), getUserBody());
  $ideaList.prepend(
    "<li value="+newIdea.id+">"+
      "<div class='idea-header'>"+
        "<h2>"+newIdea.title+"</h2>"+
        "<button type='button' class='delete-btn'>"+
        "<img src='./imgs/delete.svg' /></button>"+
      "</div>"+
      "<div class='idea-body'>"+
        "<p>"+newIdea.body+"</p>"+
      "</div>"+
      "<div class='idea-footer'>"+
        "<button type='button' class='upvote-btn'><img src='./imgs/upvote.svg'/></button>"+
        "<button type='button' class='downvote-btn'><img src='./imgs/downvote.svg' /></button>"+
        "<span>quality: </span>"+
        "<article class='idea-quality'>"+
          newIdea.quality+
        "</article>"+
      "</div>"+
    "</li>"
  );
    ideaToStorage(newIdea);
    return false;
});

$(window).load(function (){
  var IdeaIDArray = retrieveIDArray();
  IdeaIDArray.sort();
    for (var i = 0; i < IdeaIDArray.length; i++) {
      var existingIdea = retrieveIdea(IdeaIDArray[i]);
      $ideaList.prepend(
        "<li value="+existingIdea.id+">"+
          "<div class='idea-header'>"+
            "<h2>"+existingIdea.title+"</h2>"+
            "<button type='button' class='delete-btn'>"+
            "<img src='./imgs/delete.svg' /></button>"+
          "</div>"+
          "<div class='idea-body'>"+
            "<p>"+existingIdea.body+"</p>"+
          "</div>"+
          "<div class='idea-footer'>"+
            "<button type='button' class='upvote-btn'><img src='./imgs/upvote.svg'/></button>"+
            "<button type='button' class='downvote-btn'><img src='./imgs/downvote.svg' /></button>"+
            "<span>quality: </span>"+
            "<article class='idea-quality'>"+
             existingIdea.quality+
             "</article>"+
          "</div>"+
        "</li>"
     );
   }
});

function getSearchString(){
  return $search.val();
}

function showOrHideIdeas(searchString, ideaIDArray){
  for (var i = 0; i < ideaIDArray.length; i++) {
    var existingIdea = retrieveIdea(ideaIDArray[i]);

    if(!(existingIdea.title.includes(searchString)) && !(existingIdea.body.includes(searchString))){
        $search.siblings().children("[value="+existingIdea.id+"]").hide();
    } else {
        $search.siblings().children("[value="+existingIdea.id+"]").show();
    }
  }
}

$search.on('keyup', function(){
  var searchString = getSearchString();
  var ideaIDArray = retrieveIDArray();
  showOrHideIdeas(searchString,ideaIDArray);
});


$ideaList.on('click', '.delete-btn', function(){
  $(this).closest('li').remove();
  var id = $(this).closest('li').attr("value");
  removeIdeaStorage(id);
  removeIDfromArray(id);
});

$ideaList.on('mouseover', '.delete-btn', function(){
  $(this).children('img').attr('src', './imgs/delete-hover.svg');
});

$ideaList.on('mouseleave', '.delete-btn', function(){
  $(this).children('img').attr('src', './imgs/delete.svg');
});

function removeIdeaStorage(id) {
  localStorage.removeItem(id);
}

function removeIDfromArray(id) {
  var IdeaIDArray = retrieveIDArray();
  var index = IdeaIDArray.indexOf(id);
  IdeaIDArray.splice(index, 1);
  localStorage.setItem('idArray', JSON.stringify(IdeaIDArray));
}

$ideaList.on('click', '.upvote-btn', function(){
  var status = $(this).siblings('.idea-quality');
  status.text(qualityUp(status.text()));
});
$ideaList.on('click', '.downvote-btn', function(){
  var status = $(this).siblings('.idea-quality');
  status.text(qualityDown(status.text()));
});

function qualityUp(status) {
  if (status === 'swill') {
    return 'plausible';
  } else {
    return 'genius';
  }
}
function qualityDown(status) {
  if (status === 'genius') {
    return 'plausible';
  } else {
    return 'swill';
  }
}

$ideaList.on('click', 'h2', function(){
  var text = $(this).text();
  $(this).replaceWith('<textarea class="titleField">'+text+'</textarea>');
});
$ideaList.on('click', 'p', function(){
  var text = $(this).text();
  $(this).replaceWith('<textarea class="bodyField">'+text+'</textarea>');
});

$ideaList.on('blur', '.titleField', function(){
  var text = $(this).val();
  $(this).replaceWith('<h2>'+text+'</h2>');
});
$ideaList.on('blur', '.bodyField', function(){
  var text = $(this).val();
  $(this).replaceWith('<p>'+text+'</p>');
});

$ideaList.on('mouseover', 'textarea', function(){
  $(this).focus();
});
