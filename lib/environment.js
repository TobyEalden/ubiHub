/**
 * Created by toby on 25/05/15.
 */

// Disable updates on the user collection (https://dweldon.silvrback.com/common-mistakes)
Meteor.users.deny({
  update: function() {
    return true;
  }
});

