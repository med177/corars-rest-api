const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
	res.status(200).json({
		message:'/orders GET isteği geldi',
	})
});

router.post('/',(req,res,next)=>{
	res.status(201).json({
		message:'/orders POST isteği geldi',
	})
});

router.get('/:orderId',(req,res,next)=>{
	const id=req.params.productId;
	if (id==='special') {
		res.status(200).json({
			message:'/orders/:id GET isteği geldi, Özel',
			id:id
		})
	}else{
		res.status(200).json({
			message:'/orders/:id GET isteği geldi, Standart',
			id:id
		})
	}
});

router.patch('/:orderId',(req,res,next)=>{
	res.status(200).json({
		message:'Patch isteği geldi',
	})
});

router.delete('/:orderId',(req,res,next)=>{
	res.status(200).json({
		message:'DELETE isteği geldi',
	})
});

module.exports=router;