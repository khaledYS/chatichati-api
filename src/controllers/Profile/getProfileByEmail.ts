import { ObjectId } from "mongodb";
import { dbType } from "../../routes/profile";
import { findOneProfileResult, profile } from "../../mongoDataTypes";

export async function getProfileByEmailController(req: any, res: any) {
    try {
        const { db }:dbType = req.app;
        const {email} = req.body;
        // check the existence of the email 
        if(!email){
            res.status(400).json({
                message: 'you should provide Id with your request',
                // result: "no result"
                result: req.body
            })
            return;
        }

        // fetch the email profile
        const result = await db.collection("profiles").findOne<findOneProfileResult>({
            email: email,
        });
        
        // check if found
        if(!result){
            res.status(404).json({
                message: `couldn't find the profile you provided with the email :{ ${email} }`,
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