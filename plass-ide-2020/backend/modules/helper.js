module.exports = {
    failedConnectionServer : async (res ,error) => {
            res.status(200).send({
                result : 'failed',
                data : [],
                message: `Request server failed. Error : ${error}`      
        })
    },
    isAdmin : async (req) => {
        return await req.user._user[0].admin === 1 ? 1 : 0;
    }
}