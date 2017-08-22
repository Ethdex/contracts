
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4612388,
      address: "0xbA648D24bD63c90f19E3161b6FF813D3bf9e347C",
      from: "0xbA648D24bD63c90f19E3161b6FF813D3bf9e347C"
    },
    kovan: {
      host: 'localhost',
      port: 8546,
      network_id: '42',
      gas: 4612388,
      address: "0xbA648D24bD63c90f19E3161b6FF813D3bf9e347C",
      from: "0xbA648D24bD63c90f19E3161b6FF813D3bf9e347C"
    },
  },
  test_directory: 'transpiled/test',
  migrations_directory: 'transpiled/migrations',
};
