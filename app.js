var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Book = require('./Book.model')
var port = 3000
var db = 'mongodb://localhost/example'

mongoose.connect(db)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.listen(port, function() {
	console.log('app listening on port: ' + port)
})

app.get("/", function (req, res) {
	res.send("hello world")
})

app.get('/books', function (req, res){
	Book.find().exec(function(err, books) {
		if (err) {
			res.send("error reading books")
		} else {
			res.json(books)
		}
	});
}) 

app.get('/books/:id', function(req, res) {
	Book.findOne({_id: req.params.id})
		.exec(function(err, book) {
			if (err) {
				res.send("error occured")
			} else {
				res.json(book)
			}
		})
})


app.post('/book', function(req, res) {
	var newBook = new Book();
	newBook.title = req.body.title;
	newBook.author = req.body.author;
	newBook.category = req.body.category;

	newBook.save(function(err, book) {
		if (err) {
			res.send('error saving')
		} else {
			res.send(book)
		}
	})
})


app.post('/book2', function (req, res) {
	Book.create(req.body, function (err, book) {
		if (err) {
			res.send('error')
		} else {
			res.send(book)
		}
	})
})

app.put('/book/:id', function (req, res) {
	Book.findOneAndUpdate({_id: req.params.id},{	
		$set: 
			{title: req.body.title}, 
			function (err, newBook) {
				if (err) {
					res.send('error')
				} else {
					res.send(newBook)
				}
			}
		})
})

app.delete('/book/:id', function (req, res) {
	Book.findOneAndRemove({
		_id : req.params.id
	}, function (err, book){
		if (err) {
			res.send('error deleting')
		} else {
			res.status(204)
		}
	})
})