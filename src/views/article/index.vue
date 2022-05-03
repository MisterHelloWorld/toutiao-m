// TODO:文章详情页面
<template>
  <div class="article-container">
    <!-- TAG：导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="新闻头条"
      @click-left="$router.back()"
    ></van-nav-bar>

    <div class="main-wrap">
      <!-- TAG：加载中 -->
      <div v-if="status === 'loading'" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- TAG：加载完成-文章详情 -->
      <div v-if="status === 'articleDetail'" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- TAG：关注按钮组件 -->
          <FollowUser
            class="follow-btn"
            :autId="article.aut_id"
            :isFollowed.sync="article.is_followed"
          ></FollowUser>
        </van-cell>
        <!-- TAG：文章内容 -->
        <div
          ref="article-content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- TAG：评论列表组件 -->
        <CommentList
          :commentsCount.sync="commentsCount"
          :artId="article.art_id"
        ></CommentList>
        <!-- TAG：底部区域 -->
        <div class="article-bottom">
          <!-- 写评论 -->
          <van-button
            @click="isPostShow = true"
            class="comment-btn"
            type="default"
            round
            size="small"
            >写评论</van-button
          >
          <!-- 评论数量 -->
          <van-icon name="comment-o" :info="commentsCount" color="#777" />
          <!-- TAG：收藏组件 -->
          <CollectArticle
            :isCollected.sync="article.is_collected"
            :artId="article.art_id"
          ></CollectArticle>
          <!-- TAG：点赞组件 -->
          <LikeArticle
            :artId="article.art_id"
            :attitude.sync="article.attitude"
          ></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>

        <!-- TAG：底部发表评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">123 </van-popup>
      </div>

      <!-- TAG：加载失败：404 -->
      <div v-if="status === '404'" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- TAG：加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-if="status === 'error'" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="getArticleById" class="retry-btn"
          >点击重试</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// 引入图片预览方法
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import CommentList from './components/comment-list.vue'
import LikeArticle from '@/components/like-article/index.vue'
export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, CommentList, LikeArticle },
  props: {
    // 文章对应ID（使用props解耦获取的动态路由数据）
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      // 当前文章详情相关数据
      article: {},
      // 通过字段名控制哪个盒子显示
      status: 'loading',
      // 评论数量
      commentsCount: 0,
      isPostShow: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticleById()
  },
  mounted () {},
  methods: {
    async getArticleById () {
      try {
        // 每次发送请求前先重置显示为loading的盒子
        this.status = 'loading'
        // 随机模拟请求失败（未知错误）
        // if (Math.random() > 0.5) {
        //   JSON.parse('随机模拟请求失败')
        // }
        // 根据文章ID获取文章详情相关数据
        const { data } = await getArticleById(this.articleId)
        // 保存文章详细相关数据
        this.article = data.data
        // 请求成功显示文章详情的盒子
        this.status = 'articleDetail'
        this.$nextTick(() => {
          // 调用预览图片的方法
          this.PreviewImage()
        })
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // 如果捕获到404错误，显示404的盒子
          this.status = '404'
        } else {
          // 否则显示未知错误的盒子
          this.status = 'error'
        }
      }
    },
    // 预览图片的方法
    PreviewImage () {
      // 获取文章内容里的所有imgs元素
      const imgs = this.$refs['article-content'].querySelectorAll('img')
      // 定义一个专门保存图片地址的数组
      const images = []
      // 循环遍历 imgs，取出每个图片的地址
      imgs.forEach((img, index) => {
        // 将每张图片的src地址追加到images数组中
        images.push(img.src)
        // 给当前img绑定事件
        img.addEventListener('click', function () {
          // 根据当前点击图片的索引显示对应图片预览
          ImagePreview({
            // 图片数组
            images,
            // 要显示的图片的位置
            startPosition: index
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "github-markdown-css/github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
