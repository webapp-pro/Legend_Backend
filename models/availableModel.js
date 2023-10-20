import mongoose from "mongoose";
const availableSchema = new mongoose.Schema({
    user: {type: String, required: true},
    sirenLevelupState: {
        state: {type:Boolean,default:false},
       
        updatedAt: {
            type: Date,
            default: Date.now
          }
        
    },
    diamond1State: {
      state: {type:Boolean,default:false},
     
      updatedAt: {
          type: Date,
          default: Date.now
        }
      
    },
    diamond2State: {
      state: {type:Boolean,default:false},
    
      updatedAt: {
          type: Date,
          default: Date.now
        }
      
    },
    diamond3State: {
    state: {type:Boolean,default:false},
  
    updatedAt: {
        type: Date,
        default: Date.now
      }
    
  },

    hunterLevelupState: {
      state: {type:Boolean,default:false},
     
      updatedAt: {
          type: Date,
          default: Date.now
        }
      
  },
    
});
availableSchema.pre('save', function (next) {
    if (this.isModified('sirenLevelupState.state')) {
      this.sirenLevelupState.updatedAt = new Date();
    }
    if (this.isModified('diamond1State.state')) {
      this.diamond1State.updatedAt = new Date();
    }
    if (this.isModified('diamond2State.state')) {
      this.diamond2State.updatedAt = new Date();
    }
    if (this.isModified('diamond3State.state')) {
      this.diamond3State.updatedAt = new Date();
    }

    if (this.isModified('hunterLevelupState.state')) {
      this.hunterLevelupState.updatedAt = new Date();
    }
    next();
  });
  
  const Available = mongoose.model('Available', availableSchema);

export default Available;
