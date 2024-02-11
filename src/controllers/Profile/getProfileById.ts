import { ObjectId } from "mongodb";
import { dbType } from "../../routes/profile";

export async function getProfileByIdController(req: any, res: any) {
    try {
        const { db }:dbType = req.app;
        const {id} = req.body;
        // check the existence of the id 
        if(!id){
            res.status(400).json({
                message: 'you should provide Id with your request',
                // result: "no result"
                result: req.body
            })
            return;
        }

        // fetch the id profile
        const result = await db.collection("profiles").findOne({
            _id: new ObjectId(id)
        });
        
        // check if found
        if(!result){
            res.status(404).json({
                message: `couldn't find the profile you provided with the Id :{ ${id} }`,
                result: "no result"
            })
            return;
        }

        res.status(200).json({
            message: 'profile retrieved',
            result:{
                _id: result._id,
                name: result.name,
                username: result.username,
                email: result.email,
                phone: result?.phone || null,
            }
        })
        
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}