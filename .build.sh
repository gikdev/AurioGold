pnpm run build

mkdir ./dist

cp -r ./apps/admin/dist ./dist/admin
cp -r ./apps/client/dist ./dist/client

echo ""
echo "ADMIN VERSION:"
cat ./apps/admin/config.json

echo ""

echo ""
echo "CLIENT VERSION:"
cat ./apps/client/config.json
