## 本地设置用户信息

如果是初次使用 git，需要全局设置 user.name，user.email，便于在提交后了解是哪个开发者产生的提交。

```shell
git config --global user.name "Your Name"  
git config --global user.email "email@example.com"
```



## 本地 Git 仓库和 GitHub 仓库连接

第1步：创建 SSH Key。在用户主目录下，看看有没有 .ssh 目录，如果有，再看看这个目录下有没有 id_rsa 和 id_rsa.pub 这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开 Shell（Windows 下打开 Git Bash），创建 SSH Key：

```cmd
ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个 Key 也不是用于军事目的，所以也无需设置密码。

如果一切顺利的话，可以在用户主目录里找到 .ssh 目录，里面有 id_rsa 和 id_rsa.pub 两个文件，这两个就是 SSH Key 的秘钥对，id_rsa 是私钥，不能泄露出去，id_rsa.pub 是公钥，可以放心地告诉任何人。

第2步：登陆 GitHub，打开“Account settings”，“SSH Keys”页面，然后点“Add SSH Key”，填上任意Title，在 Key 文本框里粘贴 id_rsa.pub 文件的内容：



## 仓库初始化

### 本地

```shell
# 创建项目目录
mkdir learngit
cd learngit
# 初始化 git
git init
touch text.txt
git add text.txt
git commit -m "first commit"
```

### 添加远程仓库

```shell
git remote add origin git@github.com:Moon-Future/learngit.git
```

remote 即远程的意思；

origin 名称自定义，可以叫 origin1，origin2 等等；

也可以添加多个远程仓库

```shell
git remote add origin1 git@github.com:Moon-Future/learngit-1.git
git remote add origin2 git@github.com:Moon-Future/learngit-2.git
git remote add origin3 git@github.com:Moon-Future/learngit-3.git

# 查看当前仓库远程仓库列表
git remote -v
# 删除 origin1 远程仓库
git remote rm origin1
# 重命名 git remote [old-name] [new-name]
git remote origin origin1
# 修改地址
git remote set-url origin git@github.com:Moon-Future/learngit-new.git
```

### 提交到远程仓库

```shell
# 提交到 origin
git push origin master
# 提交到 origin1
git push origin1 master
# 提交到 origin2
git push origin2 master

# -u 指定默认远程仓库，下次 git push 默认推送到 origin
git push -u origin master
```

![image-20200805174333085](..\images\git\git-remote-push.png)

以上对应多个远程仓库时，要每个单独提交，如果想一个 origin 对应多个远程仓库地址，可以：

```shell
git remote set-url --push --add origin git@github.com:Moon-Future/learngit.git
git remote set-url --push --add origin git@github.com:Moon-Future/learngit-1.git

git remote -v
origin  git@github.com:Moon-Future/learngit.git (fetch)
origin  git@github.com:Moon-Future/learngit.git (push)
origin  git@github.com:Moon-Future/learngit-1.git (push)

# 同时推送到 learngit 和 learngit-1
git push origin master

# 删除其中一个
git remote set-url --push --delete origin git@github.com:Moon-Future/learngit-1.git

git remote -v
origin  git@github.com:Moon-Future/learngit.git (fetch)
origin  git@github.com:Moon-Future/learngit.git (push)
```

不过不推荐这样做，最好还是单个提交。



## Git 常用命令

![image-20200805173942961](..\images\git\git-bin.png)

### git log/reflog

git log 命令可以显示所有提交过的版本信息

git reflog 可以查看所有分支的所有操作记录（包括已经被删除的 commit 记录和 reset 的操作）

![image-20200805173350139](..\images\git\git-log.png)

新增 commit，然后再回退版本，可以看出，git log 只显示了回退后的提交信息，而 git reflog 显示了中间所有的操作记录（新增 commit，回退版本，切换分支......）

### git config

查看 git 全局配置 `git config --global --list`

### git stash

> 把所有未提交的修改（包括暂存的和非暂存的）都保存起来，用于后续恢复当前工作目录。

当你使用 git 正在开发一个功能的时候，如果你突然需要到另一个分支去开发却不想放弃当前的改动的时候，你可以：

- 先将代码 commit，切换分支修改完毕，再次切换回原分支，利用 amend 命令，取消 commit，版本回退，记录重新回复。
- 利用 git stash 命令，先将数据存到缓存，切换分支修改完毕，切换原分支，利用 git stash apply 命令将缓存数据恢复。

常用命令：

1. **`git stash save "说明"`**，这是主要的存储命令，其实可以不写 save 参数，直接 git stash 就可以，save 参数是为了加一个文字说明。实际应用中推荐给每个 stash 加一个 message，用于记录版本，使用 git stash save 取代 git stash 命令。
2. **`git stash list`**，列出所有储藏
3. **`git stash show [<stash>:Number]`**，显示某一个（默认最近一个）储藏详情
4. **`git stash drop [-q|--quiet][<stash>]`**，删除某一个（默认最近一个）储藏，`git stash pop stash@{0}`，`git stash pop stash@{1}`
5. **`git stash apply`**，应用某个存储，但不会把存储从存储列表中删除，默认使用第一个存储，即 stash@{0}，如果要使用其他个，git stash apply stash@{$num} ， 比如第二个：git stash apply stash@{1}
6. **`git stash pop`**，恢复之前缓存的工作目录，将缓存堆栈中的对应 stash 删除，并将对应修改应用到当前的工作目录下，默认为第一个 stash，即 stash@{0}，如果要应用并删除其他 stash，命令：git stash pop stash@{$num} ，比如应用并删除第二个：git stash pop stash@{1}
7. **`git stash clear`**，删除所有缓存的 stash

与 commit 区别：

- commit 提交，可以推送到远程仓库
- stash 变更状态的缓存，不能推送到远程仓库

### git status

### git diff

### git checkout

### git pull

### git fetch

### git merge

### git reset



## git 工作流