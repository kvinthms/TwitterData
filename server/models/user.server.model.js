const userSchema = new Schema({

	username: {
		type: String,
		required: true, 
		unique: true
	},

	password: { 
		type:String, 
		required:true
	},

	first_name: {
		type: String, 
		required: true
	},

	last_name: {
		type: String, 
		required: true
	},

	create_dt: Date, 
	update_dt: Date
});

userSchema.pre('save', function(next) { 
	const requestTime = new Date().toISOString();
	this.updated_at = currentTime;
	// When a user is first initialized, created_at will obviously be null, so set it to current time
	if (this.created_at == null)
	{
		this.created_at = currentTime; 
	}
	next();
});


const User = mongoose.model('User', userSchema); 

module.exports = User; 
