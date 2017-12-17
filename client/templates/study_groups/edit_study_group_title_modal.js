Template.editStudyGroupTitleModal.onCreated(function () {
  let instance = this;
  instance.processing = new ReactiveVar(false);
  instance.titleCharCount = new ReactiveVar(70);
  instance.taglineCharCount = new ReactiveVar(60);
});

Template.editStudyGroupTitleModal.onRendered(function () {
  let instance = this;
  let titleCharCount =  $("#sgTitle").val().length || 0;
  instance.titleCharCount.set(70 - titleCharCount)

  let taglineCharCount =  $("#sgTagline").val().length || 0;
  instance.taglineCharCount.set(60 - taglineCharCount)

  let tags = [ 'Below are some popular tags. Feel free to type your own! White spaces are supported.', 'JavaScript', 'Python', 'Go', 'CSS', 'PHP', 'R', 'NodeJS', 'D3', 'MongoDB', 'Meteor', 'Java'];

  instance.data.tags.forEach((tag)=> {
    if (tags.indexOf(tag) < 0) {
      tags.push(tag);
    }
  })

  tags = tags.map((tag) => {
    if (instance.data.tags.indexOf(tag) > -1) {
      return {id: tag, text: tag, selected: true}
    }
    return {id: tag, text: tag}
  })

  Meteor.setTimeout(function () {

    instance.$(".study-group-tags-multiple", tags).select2({
      placeholder: "Tags (required)",
      data: tags,
      tags: true,
      tokenSeparators: [','],
      allowClear: true
    });

  },500)

});

Template.editStudyGroupTitleModal.helpers({
  processing() {
    return  Template.instance().processing.get();
  },
  titleCharCount() {
    return  Template.instance().titleCharCount.get();
  },
  taglineCharCount() {
    return  Template.instance().taglineCharCount.get();
  }
});

Template.editStudyGroupTitleModal.events({
  "keyup #sgTitle": function(event, template){
    let titleCharCount =  $("#sgTitle").val().length || 0;
    template.titleCharCount.set(70 - titleCharCount)
  },
  "keyup #sgTagline": function(event, template){
    let taglineCharCount =  $("#sgTagline").val().length || 0;
    template.taglineCharCount.set(60 - taglineCharCount)
  },
  "submit .updateStudyGroupTitle": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#sgTitle").value) == '') {
      $('#sgTitle').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Your title cannot be empty.', 'warning', 'growl-top-right' );
    }
    if ($.trim(template.find("#sgTagline").value) == '') {
      $('#sgTitle').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Your tagline cannot be empty.', 'warning', 'growl-top-right' );
    }
    if ( $("#sgTitle").val().length > 70) {
      $('#sgTitle').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please shorten your title.', 'warning', 'growl-top-right' );
    }
    if ( $("#sgTagline").val().length > 60) {
      $('#sgTagline').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please shorten your tagline.', 'warning', 'growl-top-right' );
    }

    if (!$(".study-group-tags-multiple").val() ||$(".study-group-tags-multiple").val().length <= 2) {
      $('study-group-tags-multiple').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please save at least 3 tags. ', 'warning', 'growl-top-right' );
    }

    const data = {
      id: this._id,
      title: $.trim(template.find("#sgTitle").value),
      tagline: $.trim(template.find("#sgTagline").value),
      tags: $(".study-group-tags-multiple").val()
    }


    // console.log(data);
    template.processing.set( true );

    Meteor.call("updateStudyGroupTitle", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason , 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'The information about your study group has been updated!' , 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
