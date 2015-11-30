var _ = require('lodash');
var mongoose  = require('mongoose');
var utility   = require('utility');
var validator = require('validator');

var BaseModel = require("./base_model");
var userRoles = require('../configs/config_router').userRoles;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    loginname: { type: String},
    pass: { type: String },
    email: { type: String},
    url: { type: String },
    profile_image_url: {type: String},
    location: { type: String },
    signature: { type: String },
    profile: { type: String },
    weibo: { type: String },
    avatar: { type: String },
    is_block: {type: Boolean, default: false},

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
    active: { type: Boolean, default: false },

    receive_reply_mail: {type: Boolean, default: false },
    receive_at_mail: { type: Boolean, default: false },
    from_wp: { type: Boolean },

    retrieve_time: {type: Number},
    retrieve_key: {type: String},

    accessToken: {type: String},
});

UserSchema.plugin(BaseModel);
UserSchema.virtual('avatar_url').get(function () {
    var url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');

    // www.gravatar.com 被墙
    url = url.replace('www.gravatar.com', 'gravatar.com');

    // 让协议自适应 protocol，使用 `//` 开头
    if (url.indexOf('http:') === 0) {
        url = url.slice(5);
    }

    return url;
});

UserSchema.virtual('isAdvanced').get(function () {
    // 积分高于 700 则认为是高级用户
    return this.score > 700 || this.is_star;
});

UserSchema.statics.authenticate = function(ori_email, ori_password, callback){
    var email = validator.trim(ori_email).toLowerCase();
    var password = validator.trim(ori_password);

    this.findOne({ email: email })
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

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    //bcrypt.genSalt(10, function(err, salt) {
    //    if (err) return next(err);
    //    bcrypt.hash(user.password, salt, function(err, hash) {
    //        if (err) return next(err);
    //        user.password = hash;
    //        next();
    //    });
    //});
});

UserSchema.methods.comparePassword = function(candidatePassword, callback){
    //bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    //    if (err) return cb(err);
    //    cb(null, isMatch);
    //});
}

UserSchema.index({loginname: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({score: -1});
UserSchema.index({accessToken: 1});

var User = mongoose.model('User', UserSchema);

module.exports = User;