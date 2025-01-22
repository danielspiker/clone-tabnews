function status(request, response) {
  response.status(200).json({ frase: "sou acima da média!" });
}

export default status;
