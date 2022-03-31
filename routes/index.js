const { Router } = require('express');
const path = require('path');
const Container = require('../controllers');
const fs = require('fs');


const productList = new Container("./products.json")
const router = new Router;

router.get('/old', function (req, res) {
	res.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.get('/products', (req, res) => {
	const data = productList.getAll();
	res.json(data);
})

router.get('/products/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const prod = productList.getById(id);
	if (!prod) {
		res.json({ error: "Product Not Found" })
		return;
	}
	res.json(prod);
})

router.post('/products', (req, res) => {
	const { name, price, image } = req.body;
	productList.save({ name, price, image });
	res.json({ massega: "Producto Creado" })
})

router.delete('/products/:id', (req, res) => {
	const id = parseInt(req.params.id);
	productList.deleteById(id);
	res.send(`Producto ${id} eliminado`)
})

router.put('/products/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const { name, price, image } = req.body;
	
	try {
		const data = productList.getAll();
		const filteredProduct = data.find(el => el.id === id)
		if(!filteredProduct) {
			res.json({ error: "Product Not Found" })
			return;
		};
		
		filteredProduct.name = name;
		filteredProduct.price = price;
		filteredProduct.image = image;

		fs.writeFileSync("products.json", JSON.stringify(data, null, 2), "utf-8")
		res.send(`Producto ${id} updateado`)
	} catch (error) {
		console.log(error)
	}

})

module.exports = router;