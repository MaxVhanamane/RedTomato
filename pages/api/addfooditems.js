import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
       
        for (let i = 0; i < req.body.length; i++) {
          
            let food = new Food({
                title: req.body[i].title,
                slug: req.body[i].slug, 
                desc: req.body[i].desc,
                img: req.body[i].img,
                popularity: req.body[i].popularity,
                category: req.body[i].category,
                price: req.body[i].price,
                availableQty: req.body[i].availableQty
            })
            await food.save()
        }
        res.status(200).send({ success: "success" })
       
    }
    else {
        res.status(400).send({ error: "Not allowed" })
    }

}

// unique: req.body[i].unique,
