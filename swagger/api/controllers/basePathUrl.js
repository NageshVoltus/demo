module.exports = {
    basepath: basepath
};

function basepath(req ,res){
    console.log("Base path route success")
    res.json("Base path route success")
}
