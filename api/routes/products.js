const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
	res.status(200).json({
		message:'/products GET isteği geldi',
	})
});

router.post('/',(req,res,next)=>{
	res.status(201).json({
		message:'/products POST isteği geldi',
	})
});

router.get('/:productId',(req,res,next)=>{
	const id=req.params.productId;
	if (id==='special') {
		res.status(200).json({
			message:'/products/:id GET isteği geldi, Özel',
			id:id
		})
	}else{
		res.status(200).json({
			message:'/products/:id GET isteği geldi, Standart',
			id:id
		})
	}
});

router.patch('/:productId',(req,res,next)=>{
	res.status(200).json({
		message:'Patch isteği geldi',
	})
});

router.delete('/:productId',(req,res,next)=>{
	res.status(200).json({
		message:'DELETE isteği geldi',
	})
});

module.exports=router;