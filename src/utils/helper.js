exports.generateId = () => {
  return Math.floor(Math.random() * 1000000000) + Date.now();
};
exports.formatDate = () => {
  return new Date().toLocaleString('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};