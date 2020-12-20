此篇博文详细记录了服务器购买与环境配置，vue文件打包上传，nginx代理配置，将vue工程部署上线，可外网访问。


<h1 id="-">云服务器</h1>
<h2 id="-or-">阿里云 or 腾讯云</h2>
<ul>
<li>阿里云服务器品牌：ECS（Elastic Compute Service）</li>
<li>腾讯云服务器品牌：VCM（Cloud Virtual Machine）</li>
</ul>
<p><img src="http://qiniu.cdn.cl8023.com/%E9%98%BF%E9%87%8C%E4%BA%91or%E8%85%BE%E8%AE%AF%E4%BA%91.jpg" alt="腾讯云or阿里云"></p>
<p>两者都可以，具体可以根据自己的需求，都说阿里云稳定，腾讯云便宜，我自己买时发现两者入门级的价格都差不多，就买了阿里云的，以下即以阿里云的服务器操作。（腾讯云服务器操作应该也类似）</p>
<h2 id="-ecs">购买阿里云服务器ECS</h2>
<p>入门级最低配即可，一年300多，每月几十块钱，也可以月付，那样就贵点。
<img src="http://qiniu.cdn.cl8023.com/%E8%B4%AD%E4%B9%B0%E9%98%BF%E9%87%8C%E4%BA%91ECS.jpg" alt="">
中间有些选项默认就可，镜像选择 公共镜像-CentOS-7.4 64位（最新的）
图中密码用来之后远程登陆服务器使用。</p>
<h2 id="-">登陆服务器</h2>
<h3 id="-">阿里网页登陆</h3>
<p>在 管理控制台-实例 中可以看到刚刚购买的服务器
<img src="http://qiniu.cdn.cl8023.com/%E7%BD%91%E9%A1%B5%E8%BF%9E%E6%8E%A5%E9%98%BF%E9%87%8C%E4%BA%91ECS.jpg" alt="">
点击远程连接，出现登陆界面，第一次进入会弹出一个密码，记住这个密码（只会出现一次），之后登陆输入这个密码即可进入阿里云服务器ECS系统。</p>
<h3 id="-">客户端工具远程登陆</h3>
<ol>
<li>Mac
终端中输入：<code>SSH root@服务器IP地址(公)</code> (SSH root@192.18.222.12)
回车
输入购买服务器时设置的实例密码即可</li>
<li>Windows</li>
<li>下载工具 Xshell</li>
<li>打开Xshell - 文件 - 新建，终端选项选择编码：Unicode(UTF-8)
<img src="http://qiniu.cdn.cl8023.com/Xshell%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.jpg" alt=""></li>
<li>连接成功
<img src="http://qiniu.cdn.cl8023.com/Xshell%E8%BF%9E%E6%8E%A5%E6%88%90%E5%8A%9F.jpg" alt=""></li>
</ol>
<h1 id="-">配置环境</h1>
<p>Linux 常用命令：</p>
<ol>
<li>wget：一个从网络上自动下载文件的自由工具，支持通过 HTTP、HTTPS、FTP 三个最常见的 TCP/IP协议 下载，并可以使用 HTTP 代理。&quot;wget&quot; 这个名称来源于 “World Wide Web” 与 “get” 的结合。</li>
<li>tar：压缩解压命令<ul>
<li>-c：建立压缩档案</li>
<li>-x：解压</li>
<li>-t：查看内容</li>
<li>-r：向压缩归档文件末尾追加文件</li>
<li>-u：更新原压缩包中的文件
这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。</li>
<li>-z：有gzip属性的</li>
<li>-j：有bz2属性的</li>
<li>-Z：有compress属性的</li>
<li>-v：显示所有过程</li>
<li>-O：将文件解开到标准输出
下面的参数 -f 是必须的</li>
<li>-f：使用档案名称，最后一个参数，后面只能接档案名</li>
</ul>
</li>
<li>ln：为某一个文件或目录在另一个位置建立一个同步的链接 常用：<code>ln -s 源文件 目标文件</code></li>
<li>makdir：创建目录</li>
<li>mv：为文件或目录改名、或将文件或目录移入其它位置</li>
<li>rm：删除文件<ul>
<li>-f：忽略不存在的文件，从不给出提示</li>
<li>-r：将参数中列出的全部目录和子目录均递归的删除</li>
</ul>
</li>
<li>yum：提供了查找、安装、删除某一个、一组甚至全部软件包的命令</li>
<li>ls：显示当前目录下文件， ls -f 隐藏文件也显示</li>
<li>netstat -tpln：查看进程端口</li>
<li>kill -9 PID号：关闭进程</li>
<li>cp：拷贝</li>
</ol>
<p>Linux 目录：
前面进入Linux系统后，一般会在 root(~) 目录下 <code>[root@xxxxxxxxxxx ~]#</code>, <code>cd ..</code>可以即回到根目录，<code>ls</code>查看当前目录下文件</p>
<pre><code>[root@xxxxxxxxxxx ~]<span class="hljs-comment">#</span>
[root@xxxxxxxxxxx ~]<span class="hljs-comment"># cd ..</span>
[root@xxxxxxxxxxx /]<span class="hljs-comment">#</span>
[root@xxxxxxxxxxx /]<span class="hljs-comment"># ls</span>
bin  boot  dev  etc  home  <span class="hljs-class"><span class="hljs-keyword">lib</span>  <span class="hljs-title">lib64</span>  <span class="hljs-title">lost</span>+<span class="hljs-title">found</span>  <span class="hljs-title">media</span>  <span class="hljs-title">mnt</span>  <span class="hljs-title">opt</span>  <span class="hljs-title">proc</span>  <span class="hljs-title">root</span>  <span class="hljs-title">run</span>  <span class="hljs-title">sbin</span>  <span class="hljs-title">srv</span>  <span class="hljs-title">sys</span>  <span class="hljs-title">tmp</span>  <span class="hljs-title">usr</span>  <span class="hljs-title">var</span></span>
[root@xxxxxxxxxxx /]<span class="hljs-comment"># cd root</span>
[root@xxxxxxxxxxx ~]<span class="hljs-comment">#</span>
</code></pre><h2 id="-nodejs">安装NodeJs</h2>
<p><a href="https://help.aliyun.com/document_detail/50775.html">阿里云帮助文档：部署Node.js项目（CentOS）</a></p>
<h2 id="-mysql">安装MySQL</h2>
<p><a href="http://blog.csdn.net/zhou920786312/article/details/77750604">主要参考</a></p>
<h4 id="1-">1. 下载安装包</h4>
<p>为了下载到最新的版本，先到官网上找到下载链接
<a href="https://dev.mysql.com/downloads/mysql/">MySQL下载地址</a>
<img src="http://qiniu.cdn.cl8023.com/MySQL%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.jpg" alt="">
先用浏览器或其他下载工具创建下载任务（如x86,64-bit），然后在下载中找到下载链接复制下来就可以把它删了。</p>
<ul>
<li>进入root目录：<code>cd /root</code> （也可以其他目录）</li>
<li>下载安装包：
<code>wget https://cdn.mysql.com//Downloads/MySQL-5.7/mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz</code></li>
<li>下载完成后 ls 可以看到下载的安装包<pre><code><span class="hljs-selector-attr">[root@xxxxxxxxxxx ~]</span># <span class="hljs-selector-tag">ls</span>
<span class="hljs-selector-tag">mysql-5</span><span class="hljs-selector-class">.7</span><span class="hljs-selector-class">.20-linux-glibc2</span><span class="hljs-selector-class">.12-x86_64</span><span class="hljs-selector-class">.tar</span><span class="hljs-selector-class">.gz</span> ......
</code></pre></li>
</ul>
<h4 id="2-">2. 解压文件</h4>
<pre><code>tar -xzvf mysql-<span class="hljs-number">5.7</span>.<span class="hljs-number">19</span>-linux-glibc2.<span class="hljs-number">12</span>-x86_64.tar.gz -C /usr/local/

[root@xxxxxxxxxxx ~]<span class="hljs-comment"># ls</span>
mysql-<span class="hljs-number">5.7</span>.<span class="hljs-number">20</span>-linux-glibc2.<span class="hljs-number">12</span>-x86_64 (解压得到的目录)
mysql-<span class="hljs-number">5.7</span>.<span class="hljs-number">20</span>-linux-glibc2.<span class="hljs-number">12</span>-x86_64.tar.gz

/<span class="hljs-regexp">/ 拷贝解压到目录到 /usr</span><span class="hljs-regexp">/local 目录下，并改名为 mysql
[root@xxxxxxxxxxx ~]# cp mysql-5.7.20-linux-glibc2.12-x86_64 /usr</span><span class="hljs-regexp">/local/mysql</span> -r
[root@xxxxxxxxxxx ~]<span class="hljs-comment"># cd /usr/local/mysql</span>
[root@xxxxxxxxxxx mysql]<span class="hljs-comment"># ls</span>
bin  COPYING  docs  <span class="hljs-keyword">include</span>  <span class="hljs-class"><span class="hljs-keyword">lib</span>  <span class="hljs-title">man</span>  <span class="hljs-title">README</span>  <span class="hljs-title">share</span>  <span class="hljs-title">support</span>-<span class="hljs-title">files</span></span>
</code></pre><h4 id="3-mysql-mysql-">3. 添加系统mysql组和mysql用户</h4>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> ~]<span class="hljs-meta"># groupadd mysql #建立一个mysql的组</span>
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> ~]<span class="hljs-meta"># useradd -r -g mysql mysql #建立mysql用户，并且把用户放到mysql组</span>
</code></pre><h4 id="4-mysql-data-">4. 在 mysql 下添加 data 目录</h4>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> mysql]<span class="hljs-meta"># mkdir data</span>
</code></pre><h4 id="5-mysql-">5. 更改mysql目录下所有的目录及文件夹所属组合用户</h4>
<pre><code>[root@xxxxxxxxxxx mysql]<span class="hljs-comment"># cd /usr/local/</span>
[root@xxxxxxxxxxx local]<span class="hljs-comment"># chown -R mysql mysql/</span>
[root@xxxxxxxxxxx local]<span class="hljs-comment"># chgrp -R mysql mysql/</span>
[root@xxxxxxxxxxx local]<span class="hljs-comment"># cd mysql/</span>
[root@xxxxxxxxxxx mysql]<span class="hljs-comment"># ls -l</span>
total 56
drwxr-xr-x <span class="hljs-number"> 2 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:00 bin
-rw-r--r-- <span class="hljs-number"> 1 </span>mysql mysql<span class="hljs-number"> 17987 </span>Nov <span class="hljs-number"> 9 </span>16:00 COPYING
drwxr-xr-x <span class="hljs-number"> 6 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>18:41 data
drwxr-xr-x <span class="hljs-number"> 2 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:00 docs
drwxr-xr-x <span class="hljs-number"> 3 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:01 include
drwxr-xr-x <span class="hljs-number"> 5 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:01 lib
drwxr-xr-x <span class="hljs-number"> 4 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:00 man
-rw-r--r-- <span class="hljs-number"> 1 </span>mysql mysql <span class="hljs-number"> 2478 </span>Nov <span class="hljs-number"> 9 </span>16:00 README
drwxr-xr-x<span class="hljs-number"> 28 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>16:00 share
drwxr-xr-x <span class="hljs-number"> 2 </span>mysql mysql <span class="hljs-number"> 4096 </span>Nov <span class="hljs-number"> 9 </span>18:06 support-files
</code></pre><h4 id="6-">6. 安装和初始化数据库</h4>
<p>很多老的教程中都是运行 <code>./scripts/mysql_install_db --user=mysql</code> 进行安装，但在新版本的mysql中已经没了 scripts 目录，
mysql_install_db 放在了 bin 目录下</p>
<pre><code>[root@xxxxxxxxxxx mysql]# cd bin
[root@xxxxxxxxxxx bin]# ./mysqld <span class="hljs-comment">--initialize --user=mysql --basedir=/usr/local/mysql/--datadir=/usr/local/mysql/data/</span>


<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">52.826209</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">Warning</span>] TIMESTAMP <span class="hljs-keyword">with</span> implicit <span class="hljs-keyword">DEFAULT</span> value <span class="hljs-keyword">is</span> deprecated. Please <span class="hljs-keyword">use</span> <span class="hljs-comment">--explicit_defaults_for_timestamp server option (see documentation for more details).</span>
<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">54.885578</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">ERROR</span>] Can<span class="hljs-symbol">'t</span> find <span class="hljs-literal">error</span>-message <span class="hljs-keyword">file</span> '/usr/local/mysql/<span class="hljs-comment">--datadir=/usr/local/mysql/data/share/errmsg.sys'. Check error-message file location and 'lc-messages-dir' con</span>
figuration directive.<span class="hljs-number">2017</span>-<span class="hljs-number">08</span>-<span class="hljs-number">31</span>T08:<span class="hljs-number">50</span>:<span class="hljs-number">24.709286</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">Warning</span>] InnoDB: <span class="hljs-keyword">New</span> log files created, LSN=<span class="hljs-number">45790</span>
<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">55.105938</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">Warning</span>] InnoDB: Creating foreign key constraint system tables.
<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">55.218562</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">Warning</span>] No existing UUID has been found, so we <span class="hljs-keyword">assume</span> that this <span class="hljs-keyword">is</span> the first <span class="hljs-built_in">time</span> that this server has been started. Generating a <span class="hljs-keyword">new</span> UUID: c0844cc4-c52d-<span class="hljs-number">11e7</span>-b74f-<span class="hljs-number">00163e0</span>ae84e.
<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">55.221300</span>Z <span class="hljs-number">0</span> [<span class="hljs-literal">Warning</span>] Gtid table <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> ready <span class="hljs-keyword">to</span> be used. Table <span class="hljs-symbol">'mysql</span>.gtid_executed' cannot be opened.
<span class="hljs-number">2017</span>-<span class="hljs-number">11</span>-<span class="hljs-number">09</span>T09:<span class="hljs-number">09</span>:<span class="hljs-number">55.221784</span>Z <span class="hljs-number">1</span> [<span class="hljs-literal">Note</span>] A temporary password <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">for</span> root@localhost: uf)qP3+C?jpJ
</code></pre><p>解决：（无视警告）</p>
<pre><code>[root@xxxxxxxxxxx bin]# ./mysqld --initialize <span class="hljs-attribute">--user</span>=mysql <span class="hljs-attribute">--basedir</span>=/usr/local/mysql/ <span class="hljs-attribute">--datadir</span>=/usr/local/mysql/data/ <span class="hljs-attribute">--lc_messages_dir</span>=/usr/local/mysql/share <span class="hljs-attribute">--lc_messages</span>=en_US
</code></pre><h4 id="7-my-cnf">7. 配置my.cnf</h4>
<p>进入 /usr/local/mysql/support-files/ 目录下，查看是否存在my-default.cnf 文件，如果存在直接 copy 到 /etc/my.cnf 文件中</p>
<pre><code>[root@xxxxxxxxxxx mysql]# <span class="hljs-keyword">cp</span> -<span class="hljs-keyword">a</span> ./support-<span class="hljs-keyword">files</span>/my-default.<span class="hljs-keyword">cnf</span> /etc/my.<span class="hljs-keyword">cnf</span>
</code></pre><p>如果不存在 my-default.cnf 文件, 则在 /etc/ 目录下创建 my.cnf</p>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> bin]<span class="hljs-meta"># cd /etc</span>
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> etc]<span class="hljs-meta"># vim my.cnf</span>
</code></pre><p>写入内容</p>
<pre><code><span class="hljs-meta">#</span><span class="bash">[mysql]</span>
<span class="hljs-meta">#</span><span class="bash">basedir=/usr/<span class="hljs-built_in">local</span>/mysql/</span>
<span class="hljs-meta">#</span><span class="bash">datadir=/usr/<span class="hljs-built_in">local</span>/mysql/data/</span>
</code></pre><h4 id="8-">8. 启动服务</h4>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> mysql]<span class="hljs-meta"># cd bin/</span>
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> bin]<span class="hljs-meta"># ./mysqld_safe --user=mysql &amp;</span>
</code></pre><h4 id="9-mysqld-">9. 将mysqld服务加入开机自启动项</h4>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> bin]<span class="hljs-meta"># cd ../support-files</span>
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> support-files]<span class="hljs-meta"># cp mysql.server /etc/init.d/mysql</span>
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> support-files]<span class="hljs-meta"># chmod +x /etc/init.d/mysql</span>
-- 把mysql注册为开机启动的服务
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> support-files]<span class="hljs-meta"># chkconfig --add mysql</span>
</code></pre><h4 id="10-">10. 启动服务</h4>
<pre><code>[root@xxxxxxxxxxx bin]#<span class="hljs-built_in"> service </span>mysql start
</code></pre><p>若报错 ERROR! The server quit without updating PID file</p>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> mysql]<span class="hljs-meta"># rm  /etc/my.cnf</span>
rm: remove regular file <span class="hljs-string">'/etc/my.cnf'</span>? y
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> mysql]<span class="hljs-meta"># /etc/init.d/mysql start</span>
Starting MySQL.Logging <span class="hljs-keyword">to</span> <span class="hljs-string">'/usr/local/mysql/data/dbserver.err'</span>.
 SUCCESS!
[root<span class="hljs-symbol">@xxxxxxxxxxx</span> mysql]<span class="hljs-meta"># service mysql start</span>
Starting MySQL SUCCESS!
</code></pre><h4 id="11-mysql">11. 登录mysql</h4>
<pre><code>[root<span class="hljs-symbol">@xxxxxxxxxxx</span> bin]<span class="hljs-meta"># ./mysql -u root -p</span>
密码是第<span class="hljs-number">6</span>步产生的密码
</code></pre><p>如果出现错误：</p>
<pre><code><span class="hljs-keyword">ERROR </span>1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
</code></pre><p>重改密码</p>
<pre><code>[<span class="hljs-meta">root@xxxxxxxxxxx bin</span>]<span class="hljs-meta"># /etc/init.d/mysql stop</span>
[<span class="hljs-meta">root@xxxxxxxxxxx bin</span>]<span class="hljs-meta"># mysqld_safe --user=mysql --skip-grant-tables --skip-networking &amp;</span>
[<span class="hljs-meta">root@xxxxxxxxxxx bin</span>]<span class="hljs-meta"># mysql -u root mysql</span>
mysql&gt; UPDATE user SET Password=PASSWORD(<span class="hljs-string">'newpassword'</span>) <span class="hljs-keyword">where</span> USER=<span class="hljs-string">'root'</span>;

<span class="hljs-comment">// 上面语句若出错，换为</span>
update mysql.user <span class="hljs-keyword">set</span> authentication_string=password(<span class="hljs-string">'newpassword'</span>) <span class="hljs-keyword">where</span> user=<span class="hljs-string">'root'</span>

mysql&gt; FLUSH PRIVILEGES;
mysql&gt; quit

[<span class="hljs-meta">root@xxxxxxxxxxx bin</span>]<span class="hljs-meta"># /etc/init.d/mysqld restart</span>
[<span class="hljs-meta">root@xxxxxxxxxxx bin</span>]<span class="hljs-meta"># mysql -uroot -p</span>
Enter password:

mysql&gt;
</code></pre><h4 id="12-">12. 设置远程登录权限</h4>
<pre><code>mysql&gt;  grant <span class="hljs-literal">all</span> privileges <span class="hljs-keyword">on</span> *.* <span class="hljs-keyword">to</span><span class="hljs-string">'root'</span> @<span class="hljs-string">'%'</span> identified <span class="hljs-keyword">by</span> <span class="hljs-string">'root'</span>;
Query OK, <span class="hljs-number">0</span> <span class="hljs-keyword">rows</span> affected, <span class="hljs-number">1</span> warning (<span class="hljs-number">0.00</span> sec)

mysql&gt; flush privileges;
Query OK, <span class="hljs-number">0</span> <span class="hljs-keyword">rows</span> affected (<span class="hljs-number">0.06</span> sec)

mysql&gt; quit
Bye
</code></pre><h4 id="13-">13. 进程关闭</h4>
<p>若以上步骤中出现其他错误，可以看看 mysql 是否关闭了，先关闭端口，然后在试试</p>
<pre><code>[root@xxxxxxxxxxx ~]# netstat -tpln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local<span class="hljs-built_in"> Address </span>          Foreign<span class="hljs-built_in"> Address </span>        State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1105/sshd
tcp6       0      0 :::3306                 :::*                    LISTEN      25599/mysqld
[root@xxxxxxxxxxx ~]# kill -9 25599
</code></pre><h4 id="14-">14. 本地连接数据库</h4>
<p>我本地使用的是 Navicat for MySQL
<img src="http://qiniu.cdn.cl8023.com/%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.jpg" alt="远程连接数据库">
远程连接数据库后，创建数据表（可以导出本地数据表，然后Navicat中导入到服务器MySQL中）</p>
<h1 id="-">上传文件</h1>
<h4 id="-">打包文件</h4>
<p>项目根目录下运行</p>
<pre><code>npm <span class="hljs-keyword">run</span><span class="bash"> build</span>
</code></pre><p>等待命令运行结束后，会发现目录下多了 dist 文件夹，这个文件夹就是我们等下要放到服务器中的。</p>
<h4 id="-">文件传输</h4>
<ol>
<li>下载文件传输工具 Xftp</li>
<li>打开 Xftp 新建连接，类似Xshell，选项中勾选 “使用UTF-8编码(E)”
<img src="http://qiniu.cdn.cl8023.com/Xftp%E8%BF%9E%E6%8E%A5.jpg" alt="Xftp连接">
连接成功后可以看到左侧是本地文件目录，右侧是服务器文件目录，可以很方便的来回拖放文件。</li>
<li>创建目录文件 /root/projec/myblog (目录层级、名称随意，这里我以次为项目目录)</li>
<li>将刚刚的 dist 文件夹复制到 /root/project/myblog 目录下，前端资源就OK了</li>
<li>将 server 文件夹也复制到 /root/project/myblog 目录下</li>
</ol>
<h4 id="-">初始化项目</h4>
<p>Xshell 连接服务器</p>
<pre><code><span class="hljs-comment">// 进入项目目录</span>
[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz ~</span>]<span class="hljs-meta"># cd /root/project/myblog</span>
[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz myblog</span>]<span class="hljs-meta"># ls</span>
dist server
</code></pre><p>初始化创建 package.json，这一步也可以在本地创建编辑好后上传到服务器目录即可</p>
<pre><code>[root@izwz9e9bjg74ljcpzr7stvz myblog]# npm init
This utility will walk you through creating <span class="hljs-keyword">a</span> package.json <span class="hljs-keyword">file</span>.
It <span class="hljs-keyword">only</span> covers the most common <span class="hljs-built_in">items</span>, <span class="hljs-built_in">and</span> tries <span class="hljs-keyword">to</span> guess sensible defaults.

See `npm <span class="hljs-keyword">help</span> json` <span class="hljs-keyword">for</span> definitive documentation <span class="hljs-keyword">on</span> these fields
<span class="hljs-built_in">and</span> exactly what they <span class="hljs-keyword">do</span>.

Use `npm install <span class="hljs-symbol">&lt;pkg&gt;</span>` afterwards <span class="hljs-keyword">to</span> install <span class="hljs-keyword">a</span> package <span class="hljs-built_in">and</span>
save it <span class="hljs-keyword">as</span> <span class="hljs-keyword">a</span> dependency in the package.json <span class="hljs-keyword">file</span>.

Press ^C at any time <span class="hljs-keyword">to</span> <span class="hljs-keyword">quit</span>.
package name: (myblog)
<span class="hljs-keyword">version</span>: (<span class="hljs-number">1.0</span>.<span class="hljs-number">0</span>)
description:
entry poin<span class="hljs-variable">t:</span> (<span class="hljs-built_in">index</span>.js)
test <span class="hljs-keyword">command</span>:
git repository:
keyword<span class="hljs-variable">s:</span>
author:
license: (ISC)
About <span class="hljs-keyword">to</span> <span class="hljs-keyword">write</span> <span class="hljs-keyword">to</span> /root/project/test/myblog/package.json:

{
  <span class="hljs-string">"name"</span>: <span class="hljs-string">"myblog"</span>,
  <span class="hljs-string">"version"</span>: <span class="hljs-string">"1.0.0"</span>,
  <span class="hljs-string">"description"</span>: <span class="hljs-string">""</span>,
  <span class="hljs-string">"main"</span>: <span class="hljs-string">"index.js"</span>,
  <span class="hljs-string">"scripts"</span>: {
    <span class="hljs-string">"test"</span>: <span class="hljs-string">"echo \"Error: no test specified\" &amp;&amp; exit 1"</span>
  },
  <span class="hljs-string">"author"</span>: <span class="hljs-string">""</span>,
  <span class="hljs-string">"license"</span>: <span class="hljs-string">"ISC"</span>
}


Is this ok? (yes) yes

// 全部回车即可
[root@izwz9e9bjg74ljcpzr7stvz myblog]# <span class="hljs-keyword">ls</span>
dist  package.json  server

// 打开 package.json 编辑（也可在 Xftp 中右键文件编辑）
[root@izwz9e9bjg74ljcpzr7stvz myblog]# <span class="hljs-keyword">vim</span> package.json

    {
        <span class="hljs-string">"name"</span>: <span class="hljs-string">"my-blog"</span>,
        <span class="hljs-string">"version"</span>: <span class="hljs-string">"1.0.0"</span>,
        <span class="hljs-string">"description"</span>: <span class="hljs-string">"A Vue.js project"</span>,
        <span class="hljs-string">"author"</span>: <span class="hljs-string">"ChenLiang &lt;236338364@qq.com&gt;"</span>,
        <span class="hljs-string">"private"</span>: true,
        <span class="hljs-string">"scripts"</span>: {
            <span class="hljs-string">"dev"</span>: <span class="hljs-string">"node build/dev-server.js"</span>,
            <span class="hljs-string">"start"</span>: <span class="hljs-string">"node build/dev-server.js"</span>,
            <span class="hljs-string">"build"</span>: <span class="hljs-string">"node build/build.js"</span>
        },
        <span class="hljs-string">"dependencies"</span>: {
            <span class="hljs-string">"body-parser"</span>: <span class="hljs-string">"^1.17.2"</span>,
            <span class="hljs-string">"cookie-parser"</span>: <span class="hljs-string">"^1.4.3"</span>,
            <span class="hljs-string">"express"</span>: <span class="hljs-string">"^4.16.2"</span>,
            <span class="hljs-string">"express-session"</span>: <span class="hljs-string">"^1.15.5"</span>,
            <span class="hljs-string">"formidable"</span>: <span class="hljs-string">"^1.1.1"</span>,
            <span class="hljs-string">"highlight.js"</span>: <span class="hljs-string">"^9.12.0"</span>,
            <span class="hljs-string">"marked"</span>: <span class="hljs-string">"^0.3.6"</span>,
            <span class="hljs-string">"mysql"</span>: <span class="hljs-string">"^2.14.0"</span>,
            <span class="hljs-string">"node-sass"</span>: <span class="hljs-string">"^4.5.3"</span>,
            <span class="hljs-string">"node-uuid"</span>: <span class="hljs-string">"^1.4.8"</span>
        },
        <span class="hljs-string">"engines"</span>: {
            <span class="hljs-string">"node"</span>: <span class="hljs-string">"&gt;= 4.0.0"</span>,
            <span class="hljs-string">"npm"</span>: <span class="hljs-string">"&gt;= 3.0.0"</span>
        },
        <span class="hljs-string">"browserslist"</span>: [
            <span class="hljs-string">"&gt; 1%"</span>,
            <span class="hljs-string">"last 2 versions"</span>,
            <span class="hljs-string">"not ie &lt;= 8"</span>
        ]
    }
</code></pre><p>保存退出，运行</p>
<pre><code>[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> myblog]<span class="hljs-meta"># npm install</span>
</code></pre><p>安装&quot;dependencies&quot;中项目运行需要的所有依赖</p>
<h4 id="-">修改资源路径</h4>
<p>进入文件夹 server，打开 index.js</p>
<pre><code>[root@izwz9e9bjg74ljcpzr7stvz server]<span class="hljs-comment"># vim index.js</span>

<span class="hljs-keyword">const</span> routerApi = <span class="hljs-keyword">require</span>(<span class="hljs-string">'./router'</span>);
<span class="hljs-keyword">const</span> path = <span class="hljs-keyword">require</span>(<span class="hljs-string">'path'</span>);
<span class="hljs-keyword">const</span> bodyParser = <span class="hljs-keyword">require</span>(<span class="hljs-string">'body-parser'</span>);
<span class="hljs-keyword">const</span> express = <span class="hljs-keyword">require</span>(<span class="hljs-string">'express'</span>);
<span class="hljs-keyword">const</span> app = express();
<span class="hljs-keyword">const</span> cookieParser = <span class="hljs-keyword">require</span>(<span class="hljs-string">'cookie-parser'</span>);
<span class="hljs-keyword">const</span> session = <span class="hljs-keyword">require</span>(<span class="hljs-string">'express-session'</span>);

app.<span class="hljs-keyword">use</span>(bodyParser.json());
app.<span class="hljs-keyword">use</span>(bodyParser.urlencoded({extended: <span class="hljs-keyword">false</span>}));
app.<span class="hljs-keyword">use</span>(cookieParser());
app.<span class="hljs-keyword">use</span>(session({
    secret: <span class="hljs-string">'8023'</span>,
    <span class="hljs-comment">// cookie: {maxAge: 60000},</span>
    resave: <span class="hljs-keyword">false</span>,
    saveUninitialized: <span class="hljs-keyword">true</span>
}));

<span class="hljs-comment">// 部署上线时读取静态文件</span>
app.<span class="hljs-keyword">use</span>(express.<span class="hljs-keyword">static</span>(path.join(__dirname, <span class="hljs-string">'../dist'</span>)));

<span class="hljs-comment">// 后端api路由</span>
app.<span class="hljs-keyword">use</span>(<span class="hljs-string">'/api'</span>, routerApi);

<span class="hljs-comment">// 监听端口</span>
app.listen(<span class="hljs-number">80</span>);
console.log(<span class="hljs-string">'success listen at port:80......'</span>);
</code></pre><p>设置静态资源路径，并修改监听端口为80（HTTP端口），端口也可以设置其他值（如3000），但这样在访问地址时就需要加上端口号 www.xxx.com:3000，80端口可以省略不写，api.js 中文件路径相关的也要更改为 ../dist/static.....，嫌麻烦的也可以直接将 server 文件夹移到 dist 下就不用这么麻烦改了。</p>
<h4 id="-80-">开放 80 端口或其他端口（监听端口）</h4>
<p>登陆阿里云，进入控制管理台 -&gt; 云服务器 ECS -&gt; 安全组 -&gt; 配置规则 -&gt; 快速创建规则
<img src="http://qiniu.cdn.cl8023.com/80%E7%AB%AF%E5%8F%A3.jpg" alt="开放80端口"></p>
<h4 id="-">启动服务</h4>
<pre><code>[root@izwz9e9bjg74ljcpzr7stvz server]# node index.js
<span class="hljs-keyword">success </span>listen at port:80......
</code></pre><p>浏览器打开 服务器IP:80（如：263.182.35.68:80），如无意外，即正常运行访问啦。</p>
<h4 id="-">绑定域名</h4>
<p>进入域名管理后台，解析域名，添加解析<br><img src="http://qiniu.cdn.cl8023.com/%E5%9F%9F%E5%90%8D%E7%BB%91%E5%AE%9A.jpg" alt="域名绑定"><br>添加主机 @.xxx.com 可以通过 xxx.com 直接访问
绑定成功后，直接输入域名即可访问。</p>
<h4 id="-pm2">安装 pm2</h4>
<blockquote>
<p>pm2 是一个带有负载均衡功能的Node应用的进程管理器.</p>
</blockquote>
<p>上面我们以 node index.js 启动了项目，当我们退出 Xshell 时，进程就会关闭，无法在访问到项目，而 pm2 就是
解决这种问题的，以 pm2 启动项目后，退出 Xshell 后依然可以正常访问。</p>
<pre><code>// 安装 pm2
[root@izwz9e9bjg74ljcpzr7stvz /]<span class="hljs-comment"># npm install -g pm2</span>

// 以 -g 全局安装的插件都在 <span class="hljs-keyword">node</span> <span class="hljs-title">安装目录 bin</span> 文件下，
[root@izwz9e9bjg74ljcpzr7stvz bin]<span class="hljs-comment"># ls</span>
cnpm  <span class="hljs-keyword">node</span>  <span class="hljs-title">npm</span>  npx  pm2  pm2-dev  pm2-docker  pm2-runtime
</code></pre><p>bin 下都是命令语句，为了可以在任何目录都可以使用命令，我们将此文件夹加入环境变量</p>
<ol>
<li>查看环境变量 [root@izwz9e9bjg74ljcpzr7stvz ~]# echo $PATH</li>
<li>永久添加环境变量（影响所有用户）<pre><code> [root@izwz9e9bjg74ljcpzr7stvz ~]<span class="hljs-comment"># vim /etc/profile</span>
 <span class="hljs-regexp">//</span> 在文档最后，添加:
 <span class="hljs-comment"># node</span>
 export NODE_HOME=<span class="hljs-regexp">/root/</span>node-v8.<span class="hljs-number">9.1</span>-linux-x64
 export PATH=<span class="hljs-variable">$PATH</span>:<span class="hljs-variable">$NODE_HOME</span><span class="hljs-regexp">/bin</span>
</code></pre> 保存，退出，然后运行<pre><code> [root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> ~]<span class="hljs-meta"># source /etc/profile</span>
</code></pre></li>
</ol>
<p>pm2 启动项目</p>
<pre><code>[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz ~</span>]<span class="hljs-meta"># cd /root/project/myblog/server</span>
<span class="hljs-comment">// 启动进程</span>
[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz server</span>]<span class="hljs-meta"># pm2 start index.js</span>
<span class="hljs-comment">// 停止进程</span>
[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz server</span>]<span class="hljs-meta"># pm2 stop index.js</span>
<span class="hljs-comment">// 查看进程</span>
[<span class="hljs-meta">root@izwz9e9bjg74ljcpzr7stvz server</span>]<span class="hljs-meta"># pm2 list</span>
</code></pre><h4 id="-404">刷新页面404</h4>
<p><a href="https://router.vuejs.org/zh-cn/essentials/history-mode.html">HTML5 History 模式</a>，
最后有nginx的配置。</p>
<h1 id="linux-">Linux中文乱码 （修改默认编码）</h1>
<p>如文件或文件夹含有中文字符时，可能会读取乱码，读取不到文章，需要修改系统默认编码
<a href="http://www.linuxidc.com/Linux/2017-07/145572.htm">修改默认编码</a></p>
<h1 id="nginx-">Nginx 服务器</h1>
<blockquote>
<p>上面我们是直接以 node 启动一个服务器，监听 80 端口，这样我们就可以直接以 IP 地址或域名的方式访问，也可以监听其他端口如3000，这样我们就得在地址后加上 : 端口号，显然这样很麻烦，且一般 node 程序基本不监听 80 端口，还可能同时运行几个 node 项目，监听不同的端口，通过二级域名来分别访问。 这里就用到 Nginx 来实现反向代理。（node 利用 node-http-proxy 包也可以实现反向代理，有兴趣自己了解）</p>
</blockquote>
<h2 id="nginx-">Nginx安装</h2>
<p>Nginx依赖下面3个包:</p>
<ol>
<li>SSL功能需要openssl库，下载地址 <a href="http://www.openssl.org/">http://www.openssl.org/</a></li>
<li>rewrite模块需要pcre库，下载地址 <a href="http://www.pcre.org/">http://www.pcre.org/</a></li>
<li>gzip模块需要zlib库，下载地址 <a href="http://www.zlib.net/">http://www.zlib.net/</a></li>
<li>Nginx安装包</li>
</ol>
<p>进入任意目录下载以上压缩包(版本号改为最新即可)：</p>
<pre><code>[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> download]<span class="hljs-meta"># wget http://www.zlib.net/zlib-1.2.11.tar.gz</span>
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> download]<span class="hljs-meta"># wget https://ftp.pcre.org/pub/pcre/pcre-8.41.tar.gz</span>
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> download]<span class="hljs-meta"># wget https://www.openssl.org/source/openssl-fips-2.0.16.tar.gz</span>
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> download]<span class="hljs-meta"># wget http://nginx.org/download/nginx-1.13.7.tar.gz</span>
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> download]<span class="hljs-meta"># ls</span>
pcre<span class="hljs-number">-8.41</span>.tar.gz   zlib<span class="hljs-number">-1.2</span><span class="hljs-number">.11</span>.tar.gz
nginx<span class="hljs-number">-1.13</span><span class="hljs-number">.7</span>.tar.gz  openssl-fips<span class="hljs-number">-2.0</span><span class="hljs-number">.16</span>.tar.gz
</code></pre><p>解压压缩包：</p>
<pre><code><span class="hljs-selector-attr">[root@izwz9e9bjg74ljcpzr7stvz download]</span># <span class="hljs-selector-tag">tar</span> <span class="hljs-selector-tag">zxvf</span> <span class="hljs-selector-tag">zlib-1</span><span class="hljs-selector-class">.2</span><span class="hljs-selector-class">.11</span><span class="hljs-selector-class">.tar</span><span class="hljs-selector-class">.gz</span>
<span class="hljs-selector-attr">[root@izwz9e9bjg74ljcpzr7stvz download]</span># <span class="hljs-selector-tag">tar</span> <span class="hljs-selector-tag">tar</span> <span class="hljs-selector-tag">zxvf</span> <span class="hljs-selector-tag">pcre-8</span><span class="hljs-selector-class">.41</span><span class="hljs-selector-class">.tar</span><span class="hljs-selector-class">.gz</span>
<span class="hljs-selector-attr">[root@izwz9e9bjg74ljcpzr7stvz download]</span># <span class="hljs-selector-tag">tar</span> <span class="hljs-selector-tag">zxvf</span> <span class="hljs-selector-tag">openssl-fips-2</span><span class="hljs-selector-class">.0</span><span class="hljs-selector-class">.16</span><span class="hljs-selector-class">.tar</span><span class="hljs-selector-class">.gz</span>
<span class="hljs-selector-attr">[root@izwz9e9bjg74ljcpzr7stvz download]</span># <span class="hljs-selector-tag">tar</span> <span class="hljs-selector-tag">zxvf</span> <span class="hljs-selector-tag">nginx-1</span><span class="hljs-selector-class">.13</span><span class="hljs-selector-class">.7</span><span class="hljs-selector-class">.tar</span><span class="hljs-selector-class">.gz</span>
</code></pre><p>先安装3个依赖包，分别进入各自解压目录</p>
<pre><code><span class="hljs-comment">// 看清各个目录下的是 configure 还是 config</span>
[root@izwz9e9bjg74ljcpzr7stvz zlib<span class="hljs-number">-1.2</span><span class="hljs-number">.11</span>]# ./configuer &amp;&amp; make &amp;&amp; make install
[root@izwz9e9bjg74ljcpzr7stvz pcre<span class="hljs-number">-8.41</span>]# ./configuer &amp;&amp; make &amp;&amp; make install
[root@izwz9e9bjg74ljcpzr7stvz openssl-fips<span class="hljs-number">-2.0</span><span class="hljs-number">.16</span>]# ./config &amp;&amp; make &amp;&amp; make install
[root@izwz9e9bjg74ljcpzr7stvz nginx<span class="hljs-number">-1.13</span><span class="hljs-number">.7</span>]# ./configure --with-pcre=../pcre<span class="hljs-number">-8.41</span>/ --with-zlib=../zlib<span class="hljs-number">-1.2</span><span class="hljs-number">.11</span>/ --with-openssl=../openssl-fips<span class="hljs-number">-2.0</span><span class="hljs-number">.16</span>/
[root@izwz9e9bjg74ljcpzr7stvz nginx<span class="hljs-number">-1.13</span><span class="hljs-number">.7</span>]# make &amp;&amp; make install
</code></pre><p>安装 C++ 编译环境 （上面安装过程中如若有报错，可以看看是不是因为没有安装这个，可提前安装）</p>
<pre><code><span class="hljs-comment">yum</span> <span class="hljs-comment">install</span> <span class="hljs-comment">gcc</span><span class="hljs-literal">-</span><span class="hljs-comment">c</span><span class="hljs-literal">+</span><span class="hljs-literal">+</span>
</code></pre><h2 id="-nginx">运行Nginx</h2>
<p>安装好的Nginx路径在 /usr/local/nginx</p>
<pre><code>[root@izwz9e9bjg74ljcpzr7stvz ~]# <span class="hljs-keyword">cd</span> /usr/<span class="hljs-keyword">local</span>/nginx
[root@izwz9e9bjg74ljcpzr7stvz nginx]# <span class="hljs-keyword">ls</span>
client_body_temp  <span class="hljs-keyword">conf</span>  fastcgi_temp  html  logs  nginx.<span class="hljs-keyword">conf</span>  proxy_temp  sbin  scgi_temp  uwsgi_temp
</code></pre><p>配置文件路径：</p>
<pre><code>/usr/<span class="hljs-keyword">local</span>/nginx/<span class="hljs-keyword">conf</span>/nginx.<span class="hljs-keyword">conf</span>
</code></pre><p>运行Nginx：</p>
<pre><code>[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> ~]<span class="hljs-meta"># cd /usr/local/nginx/sbin</span>
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> sbin]<span class="hljs-meta"># ./nginx</span>
// 查看是否运行成功
[root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> sbin]<span class="hljs-meta"># netstat -ntlp</span>
Active Internet connections (only servers)
Proto Recv-Q <span class="hljs-built_in">Send</span>-Q <span class="hljs-keyword">Local</span> Address           Foreign Address         State       PID/Program name
tcp        <span class="hljs-number">0</span>      <span class="hljs-number">0</span> <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span>:<span class="hljs-number">80</span>              <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span>:*               LISTEN      <span class="hljs-number">3525</span>/nginx: master
</code></pre><p>浏览器输入 IP 地址或域名即可见到欢迎页面。</p>
<h2 id="-server-nginx-">使用server命令启动nginx服务</h2>
<p>现在nginx启动、关闭比较麻烦，关闭要找到PID号，然后杀死进程，启动要进入到 /usr/local/nginx/sbin 目录下使用命令，为此我们通过设置System V脚本来使用server命令启动、关闭、重启nginx服务。</p>
<ol>
<li>在 /etc/init.d 目录下创建nginx启动脚本文件<pre><code> [root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> ~]<span class="hljs-meta"># cd /etc/init.d</span>
 [root<span class="hljs-symbol">@izwz9e9bjg74ljcpzr7stvz</span> init.d]<span class="hljs-meta"># vim nginx</span>
</code></pre></li>
<li><p>将以下代码复制粘贴进去，然后保存。 注意 NGINX_BIN、CONFIGFILE、PIDFILE 三个目录要对应好，默认是对应好的。在网上找了好多相关脚本代码，都有很多问题，好像是和 CentOS 版本有关，下面脚本我在 CentOS 7 下使用正常。</p>
<pre><code> <span class="hljs-comment">#! /bin/sh</span>
 <span class="hljs-comment"># chkconfig: 2345 55 25</span>
 <span class="hljs-comment"># Description: Startup script for nginx webserver on Debian. Place in /etc/init.d and</span>
 <span class="hljs-comment"># run 'update-rc.d -f nginx defaults', or use the appropriate command on your</span>
 <span class="hljs-comment"># distro. For CentOS/Redhat run: 'chkconfig --add nginx'</span>

 <span class="hljs-comment">### BEGIN INIT INFO</span>
 <span class="hljs-comment"># Provides:          nginx</span>
 <span class="hljs-comment"># Required-Start:    $all</span>
 <span class="hljs-comment"># Required-Stop:     $all</span>
 <span class="hljs-comment"># Default-Start:     2 3 4 5</span>
 <span class="hljs-comment"># Default-Stop:      0 1 6</span>
 <span class="hljs-comment"># Short-Description: starts the nginx web server</span>
 <span class="hljs-comment"># Description:       starts nginx using start-stop-daemon</span>
 <span class="hljs-comment">### END INIT INFO</span>

 <span class="hljs-comment"># Author:   licess</span>
 <span class="hljs-comment"># website:  http://lnmp.org</span>

 PATH=/usr/<span class="hljs-built_in">local</span>/sbin:/usr/<span class="hljs-built_in">local</span>/bin:/sbin:/bin:/usr/sbin:/usr/bin
 NAME=nginx
 NGINX_BIN=/usr/<span class="hljs-built_in">local</span>/nginx/sbin/<span class="hljs-variable">$NAME</span>
 CONFIGFILE=/usr/<span class="hljs-built_in">local</span>/nginx/conf/<span class="hljs-variable">$NAME</span>.conf
 PIDFILE=/usr/<span class="hljs-built_in">local</span>/nginx/logs/<span class="hljs-variable">$NAME</span>.pid

 <span class="hljs-keyword">case</span> <span class="hljs-string">"<span class="hljs-variable">$1</span>"</span> <span class="hljs-keyword">in</span>
     start)
         <span class="hljs-built_in">echo</span> -n <span class="hljs-string">"Starting <span class="hljs-variable">$NAME</span>... "</span>

         <span class="hljs-keyword">if</span> netstat -tnpl | grep -q nginx;<span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> (pid `pidof <span class="hljs-variable">$NAME</span>`) already running."</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">fi</span>

         <span class="hljs-variable">$NGINX_BIN</span> -c <span class="hljs-variable">$CONFIGFILE</span>

         <span class="hljs-keyword">if</span> [ <span class="hljs-string">"$?"</span> != 0 ] ; <span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" failed"</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">else</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" done"</span>
         <span class="hljs-keyword">fi</span>
         ;;

     stop)
         <span class="hljs-built_in">echo</span> -n <span class="hljs-string">"Stoping <span class="hljs-variable">$NAME</span>... "</span>

         <span class="hljs-keyword">if</span> ! netstat -tnpl | grep -q nginx; <span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> is not running."</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">fi</span>

         <span class="hljs-variable">$NGINX_BIN</span> -s stop

         <span class="hljs-keyword">if</span> [ <span class="hljs-string">"$?"</span> != 0 ] ; <span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" failed. Use force-quit"</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">else</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" done"</span>
         <span class="hljs-keyword">fi</span>
         ;;

     status)
         <span class="hljs-keyword">if</span> netstat -tnpl | grep -q nginx; <span class="hljs-keyword">then</span>
             PID=`pidof nginx`
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> (pid <span class="hljs-variable">$PID</span>) is running..."</span>
         <span class="hljs-keyword">else</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> is stopped"</span>
             <span class="hljs-built_in">exit</span> 0
         <span class="hljs-keyword">fi</span>
         ;;

     force-quit)
         <span class="hljs-built_in">echo</span> -n <span class="hljs-string">"Terminating <span class="hljs-variable">$NAME</span>... "</span>

         <span class="hljs-keyword">if</span> ! netstat -tnpl | grep -q nginx; <span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> is not running."</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">fi</span>

         <span class="hljs-built_in">kill</span> `pidof <span class="hljs-variable">$NAME</span>`

         <span class="hljs-keyword">if</span> [ <span class="hljs-string">"$?"</span> != 0 ] ; <span class="hljs-keyword">then</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" failed"</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">else</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" done"</span>
         <span class="hljs-keyword">fi</span>
         ;;

     restart)
         <span class="hljs-variable">$0</span> stop
         sleep 1
         <span class="hljs-variable">$0</span> start
         ;;

     reload)
         <span class="hljs-built_in">echo</span> -n <span class="hljs-string">"Reload service <span class="hljs-variable">$NAME</span>... "</span>

         <span class="hljs-keyword">if</span> netstat -tnpl | grep -q nginx; <span class="hljs-keyword">then</span>
             <span class="hljs-variable">$NGINX_BIN</span> -s reload
             <span class="hljs-built_in">echo</span> <span class="hljs-string">" done"</span>
         <span class="hljs-keyword">else</span>
             <span class="hljs-built_in">echo</span> <span class="hljs-string">"<span class="hljs-variable">$NAME</span> is not running, can't reload."</span>
             <span class="hljs-built_in">exit</span> 1
         <span class="hljs-keyword">fi</span>
         ;;

     configtest)
         <span class="hljs-built_in">echo</span> -n <span class="hljs-string">"Test <span class="hljs-variable">$NAME</span> configure files... "</span>

         <span class="hljs-variable">$NGINX_BIN</span> -t
         ;;

     *)
         <span class="hljs-built_in">echo</span> <span class="hljs-string">"Usage: <span class="hljs-variable">$0</span> {start|stop|force-quit|restart|reload|status|configtest}"</span>
         <span class="hljs-built_in">exit</span> 1
         ;;

 <span class="hljs-keyword">esac</span>
</code></pre></li>
<li>修改脚本权限<pre><code> chmod a+x <span class="hljs-regexp">/etc/i</span>nit.d<span class="hljs-regexp">/nginx</span>
</code></pre></li>
<li>注册成服务<pre><code> chkconfig --<span class="hljs-keyword">add</span><span class="bash"> nginx</span>
</code></pre></li>
<li>设置开机启动<pre><code> chkconfig nginx <span class="hljs-keyword">on</span>
</code></pre>这样就可以在任意目录通过service启动、关闭nginx<pre><code>[root@izwz9e9bjg74ljcpzr7stvz ~]#<span class="hljs-built_in"> service </span>nginx start
[root@izwz9e9bjg74ljcpzr7stvz ~]#<span class="hljs-built_in"> service </span>nginx stop
[root@izwz9e9bjg74ljcpzr7stvz ~]#<span class="hljs-built_in"> service </span>nginx restart
</code></pre></li>
</ol>
<h2 id="-nginx-conf-node-">配置nginx.conf反向代理多个node项目</h2>
<ol>
<li>启动多个node项目，分别监听不同端口，如<ul>
<li>项目1，监听端口3000，为博客项目，域名访问 www.cl8023.com 或 cl8023.com</li>
<li>项目2，监听端口8023，为游戏项目，域名访问 game.cl8023.com</li>
</ul>
</li>
<li>在阿里云服务区控制台开放端口3000和8023，（80端口是必须的，nginx监听）</li>
<li>绑定二级域名 game.cl8023.com，添加域名解析<ul>
<li>记录类型：A</li>
<li>主机记录：game</li>
<li>解析线路：默认</li>
<li>记录纸：IP地址</li>
<li>TTL至：10分钟（默认）</li>
</ul>
</li>
<li><p>修改nginx配置<br> 进入目录 /usr/local/nginx/conf 修改配置文件nginx.conf</p>
<pre><code> [root@izwz9e9bjg74ljcpzr7stvz ~]# <span class="hljs-keyword">cd</span> /usr/<span class="hljs-keyword">local</span>/nginx/<span class="hljs-keyword">conf</span>
 [root@izwz9e9bjg74ljcpzr7stvz <span class="hljs-keyword">conf</span>]# <span class="hljs-keyword">ls</span>
 fastcgi.<span class="hljs-keyword">conf</span>          fastcgi_params          koi-utf  mime.types          nginx.<span class="hljs-keyword">conf</span>          scgi_params          uwsgi_params          <span class="hljs-keyword">win</span>-utf
 fastcgi.<span class="hljs-keyword">conf</span>.default  fastcgi_params.default  koi-<span class="hljs-keyword">win</span>  mime.types.default  nginx.<span class="hljs-keyword">conf</span>.default  scgi_params.default  uwsgi_params.default
 [root@izwz9e9bjg74ljcpzr7stvz <span class="hljs-keyword">conf</span>]# vim nginx.<span class="hljs-keyword">conf</span>
 <span class="hljs-comment">// server 内容替换为</span>
     server {
         listen 80;
         server_name game.cl8023.com;
         location / {
             proxy_set_header   Host      <span class="hljs-variable">$http_host</span>;
             proxy_pass         http:<span class="hljs-comment">//127.0.0.1:8023;</span>
             proxy_redirect     off;
             proxy_set_header   X-Real-IP       <span class="hljs-variable">$remote_addr</span>;
             proxy_set_header   X-Forwarded-<span class="hljs-keyword">For</span> <span class="hljs-variable">$proxy_add_x_forwarded_for</span>;
         }
     }

     server {
         listen 80;
         server_name cl8023.com www.cl8023.com;

         # 解决刷新404的问题
         location /blog {
             try_files <span class="hljs-variable">$uri</span> <span class="hljs-variable">$uri</span>/ /index.html;
         }

         location / {
             proxy_set_header   Host      <span class="hljs-variable">$http_host</span>;
             proxy_pass         http:<span class="hljs-comment">//127.0.0.1:3000;</span>
             proxy_redirect     off;
             proxy_set_header   X-Real-IP       <span class="hljs-variable">$remote_addr</span>;
             proxy_set_header   X-Forwarded-<span class="hljs-keyword">For</span> <span class="hljs-variable">$proxy_add_x_forwarded_for</span>;
         }
     }
</code></pre><p> 若只配置一个server，game.cl8023.com、cl8023.com、www.cl8023.com 都将可以访问到这个端口。想要反响代理更多端口，可再增加server，也可以将server单独出来为一个文件，如game-8023.conf，blog-3000.conf，然后在nginx.conf中引入文件地址即可</p>
<pre><code> http {
     ......
     include ./vhost/game<span class="hljs-number">-8023.</span>conf; 
     include ./vhost/blog<span class="hljs-number">-3000.</span>conf;
     ......
 }
</code></pre></li>
<li>重启nginx<pre><code> [root@izwz9e9bjg74ljcpzr7stvz ~]#<span class="hljs-built_in"> service </span>nginx restart
</code></pre>无误的话便可以使用不同的域名访问不同的项目。</li>
</ol>
