import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'ChangeAccountInformation'(userInformation, newPassword, username){
    Accounts.setUsername(userInformation._id, username);
    if (newPassword) {
      Accounts.setPassword(userInformation._id, userInformation.password, '');
    }
    Meteor.users.update(
      { _id: userInformation._id },
      { $set: {
        'emails.0.address': userInformation.emails[0].address,
        profile: userInformation.profile,
      }}
    );
  }
});
