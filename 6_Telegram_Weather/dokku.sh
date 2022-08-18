#!/usr/bin/env bash
set -e

APP=${APP:-test}
SSH_INSTANCE=${SSH_INSTANCE:-cinfu}
SSH_PARAMS="-o StrictHostKeyChecking=no ${SSH_PARAMS:-}"

docker build --platform linux/amd64 -t dokku/"$APP":latest .
docker save dokku/"$APP":latest | gzip | pv | ssh $SSH_PARAMS "$SSH_INSTANCE" "docker load"
#on first create dokku git:from-image $APP dokku/"$APP":latest
#ssh $SSH_PARAMS "$SSH_INSTANCE" "dokku git:from-image $APP dokku/"$APP":latest; dokku cleanup"
ssh $SSH_PARAMS "$SSH_INSTANCE" "dokku ps:rebuild $APP; dokku cleanup"
