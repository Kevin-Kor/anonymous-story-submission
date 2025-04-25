#!/bin/bash

# 간단한 배포 스크립트
# GitHub Pages에 배포하는 예시입니다.

echo "===== 익명 사연 제보 페이지 배포 스크립트 ====="
echo "이 스크립트는 GitHub Pages에 페이지를 배포합니다."
echo ""

# 현재 디렉토리가 git 저장소인지 확인
if [ ! -d .git ]; then
  echo "현재 디렉토리가 git 저장소가 아닙니다."
  read -p "git 저장소로 초기화하시겠습니까? (y/n): " init_git
  
  if [ "$init_git" = "y" ]; then
    git init
    echo "Git 저장소가 초기화되었습니다."
  else
    echo "배포를 취소합니다."
    exit 1
  fi
fi

# 원격 저장소 확인
remote_exists=$(git remote -v | grep origin)

if [ -z "$remote_exists" ]; then
  echo "원격 저장소가 설정되어 있지 않습니다."
  read -p "GitHub 저장소 URL을 입력하세요 (https://github.com/username/repo.git): " repo_url
  
  if [ -n "$repo_url" ]; then
    git remote add origin $repo_url
    echo "원격 저장소가 설정되었습니다."
  else
    echo "저장소 URL이 입력되지 않았습니다. 배포를 취소합니다."
    exit 1
  fi
fi

# 파일 추가
echo "파일 변경사항을 스테이징합니다..."
git add .

# 커밋
read -p "커밋 메시지를 입력하세요: " commit_msg

if [ -z "$commit_msg" ]; then
  commit_msg="사연 제보 페이지 업데이트"
fi

git commit -m "$commit_msg"

# 브랜치 확인
current_branch=$(git branch --show-current)

if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
  echo "현재 '$current_branch' 브랜치에 있습니다."
  read -p "main 브랜치로 전환하시겠습니까? (y/n): " switch_branch
  
  if [ "$switch_branch" = "y" ]; then
    # main 브랜치가 있는지 확인
    main_exists=$(git branch --list main)
    
    if [ -n "$main_exists" ]; then
      git checkout main
    else
      # master 브랜치가 있는지 확인
      master_exists=$(git branch --list master)
      
      if [ -n "$master_exists" ]; then
        git checkout master
      else
        # 새 main 브랜치 생성
        git checkout -b main
        echo "main 브랜치가 생성되었습니다."
      fi
    fi
  fi
fi

# 푸시
echo "변경사항을 원격 저장소에 푸시합니다..."
git push -u origin $(git branch --show-current)

echo ""
echo "=== 배포 완료 ==="
echo "GitHub Pages를 활성화하려면 다음 단계를 따라주세요:"
echo "1. GitHub 저장소 페이지로 이동합니다."
echo "2. 'Settings' 탭을 클릭합니다."
echo "3. 왼쪽 메뉴에서 'Pages'를 클릭합니다."
echo "4. 'Source' 섹션에서 '$(git branch --show-current)' 브랜치를 선택합니다."
echo "5. 'Save' 버튼을 클릭합니다."
echo ""
echo "몇 분 후 사이트가 다음 URL에서 사용 가능할 것입니다:"
remote_url=$(git remote get-url origin)
username_repo=$(echo $remote_url | sed -E 's/.*github.com[\/:]([^\/]+\/[^\/]+)(\.git)?$/\1/')
echo "https://${username_repo%.git}.github.io/${remote_url##*/}"