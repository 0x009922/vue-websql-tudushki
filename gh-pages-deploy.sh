PUBLIC_PATH=/vue-websql-tudushki/ yarn build
cd dist
git init
git add --all
git commit -m 'Build'
git remote add origin git@github.com:LiquidSolid/vue-websql-tudushki.git
git push -f origin master:gh-pages
