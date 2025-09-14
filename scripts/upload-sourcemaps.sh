#!/bin/bash
set -e

# 🌿 Get current Git branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 🧠 Set BUILD_ENV based on branch
if [ "$BRANCH" = "master" ]; then
	export BUILD_ENV="prod"
else
	export BUILD_ENV="dev"
fi

echo "🛠 Running build for $BUILD_ENV"
export GENERATE_SOURCEMAP=true
npx env-cmd -e $BUILD_ENV yarn build

# 📦 Get app version and construct release name
APP_VERSION=$(node -p "require('./package.json').version")
RELEASE="bookipi-v2-frontend@$APP_VERSION"

# 🏷️ Add -staging if not on master
if [ "$BRANCH" != "master" ]; then
	RELEASE="$RELEASE-staging"
fi

echo "🚀 Uploading sourcemaps to Sentry for release: $RELEASE"
sentry-cli releases new "$RELEASE"

find ./build/static/js -name '*.map' \
	! -name '*chunk.js.map' \
	! -name '*vendor*.map' \
	! -name '*build.min.js.map' \
	! -path '*/node_modules/*' |
	while read -r mapfile; do
		jsfile="${mapfile%.map}"
		if [ -f "$jsfile" ]; then
			echo "📄 Uploading: $jsfile + $mapfile"
			sentry-cli releases files "$RELEASE" upload-sourcemaps "$jsfile" "$mapfile" \
				--url-prefix '~/static/js' \
				--validate \
				--no-rewrite
		fi
	done

sentry-cli releases finalize "$RELEASE"

echo "✅ Build and sourcemap upload complete for release: $RELEASE"
