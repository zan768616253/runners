var _ = require('lodash');
var check = require('validator').check;

var mongoose = require('../configs/config.js').mongoose;
var userRoles = require('../configs/config_router').userRoles;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: { type: String, index: true },
    name: { type: String, index: true },
    loginname: { type: String, unique: true },
    pass: { type: String },
    email: { type: String, unique: true },
    url: { type: String },
    profile_image_url: {type: String},
    location: { type: String },
    signature: { type: String },
    profile: { type: String },
    weibo: { type: String },
    avatar: { type: String },

    score: { type: Number, default: 0 },
    topic_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },
    follower_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    collect_tag_count: { type: Number, default: 0 },
    collect_topic_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    is_star: { type: Boolean },
    level: { type: String },
    active: { type: Boolean, default: true },

    receive_reply_mail: {type: Boolean, default: false },
    receive_at_mail: { type: Boolean, default: false },
    from_wp: { type: Boolean },

    retrieve_time : {type: Number},
    retrieve_key : {type: String}
});

UserSchema.statics.authenticate = function(email, password, callback){
    this.findOne({ email: email }).select('password')
        .exec(function(err, user){
            if (err) {
                return callback(err, null);
            }
            if(!user){
                return callback(err, user);
            }

            if(password == user.pass){
                user.pass = undefined;
                callback(err, user);
            }else{
                return callback(err, null);
            }
        })
}

var User = mongoose.model('User', UserSchema);

module.exports = User;