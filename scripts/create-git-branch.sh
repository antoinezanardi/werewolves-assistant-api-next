#!/bin/bash
PS3="Are you starting a feature or a fix ? "
select option in "feat" "fix"; do
  case $option in
  feat | fix)
    SELECTED_OPTION=$option
    break
    ;;
  *)
    echo "❌  Invalid option: \"$REPLY\". Please choose between 1 or 2 you ding-dong."
    ;;
  esac
done

while true; do
  echo "Please provide your branch name, it must be kebab-case (like: 'my-feature') : "
  read -r FEATURE_NAME
  if [[ -z "$FEATURE_NAME" ]]; then
    echo "You must provide a branch name."
    continue
  fi
  if ! [[ "$FEATURE_NAME" =~ ^[a-z]+(-[a-z]+)*$ ]]; then
    echo "❌  Your branch name must be in kebab-case."
    continue
  fi
  break
done

BRANCH_NAME="$SELECTED_OPTION/$FEATURE_NAME"
git checkout -b "$BRANCH_NAME"
echo "You're all set 🚀"
