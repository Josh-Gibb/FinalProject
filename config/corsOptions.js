const WhiteList = [
    "http://localhost:3000",
    "https://Josh-Gibb-FinalProject.glitch.me",
    "nostalgic-quilled-cephalopod.glitch.me"
];

const corsOptions = {
    origin: (origin, callback) =>{
        if(WhiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        } else{
            callback(new Error("Not Allowed By CORS"));
        }
    }, 
    optionSuccessStatus: 200,
};

module.exports = corsOptions;