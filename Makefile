SOLC=solc
LOOM=loom
CONTRACTSPATH=./dappchain/contracts
DAPPCHAINPATH=./dappchain
SOLCFLAGS=--abi --bin

all: compile_contracts init run

compile_contracts:
	cd $(CONTRACTSPATH) && $(SOLC) $(SOLCFLAGS) *.sol
	find $(CONTRACTSPATH) -name *.abi | sed -e 'p;s/\.abi$//\.json/' | xargs -n2 mv

init:
	cd $(DAPPCHAINPATH) && \
	loom init && \
	cp genesis.dist.json genesis.json

run:
	cd $(DAPPCHAINPATH) && \
	loom run

clear:
	rm -rf $(DAPPCHAINPATH)/chaindata
	rm -rf $(DAPPCHAINPATH)/app.db
	rm -rf $(DAPPCHAINPATH)/genesis.json
	rm -rf $(CONTRACTSPATH)/*.abi $(CONTRACTSPATH)/*.bin $(CONTRACTSPATH)/*.json