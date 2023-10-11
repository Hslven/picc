import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {RouteLocationNormalized} from 'vue-router';
import store from '@/store'

interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}
@Module({ dynamic: true, store, name: 'tagsView' })
export default class TagsView extends VuexModule {
  public visitedViews:TagView[]=[]

  @Mutation
  private ADD_VISITED_VIEW(view:any) {
    if (this.visitedViews.some((v) => v.path === view.path)) return;
    if (view.meta && view.meta.affix) {
      this.visitedViews.unshift(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name',
          })
      );
    } else {
      this.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name',
          })
      );
    }
  }

  @Mutation
  private DEL_VISITED_VIEW(view: any) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  }

  @Mutation
  private DEL_OTHERS_VISITED_VIEWS(view: any) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.meta?.affix || v.path === view.path
    })
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    // keep affix tags
    this.visitedViews = this.visitedViews.filter(tag => tag.meta?.affix)
  }

  @Mutation
  private UPDATE_VISITED_VIEW(view: any) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }

  @Action
  public addView(view: any) {
    this.ADD_VISITED_VIEW(view)
  }

  @Action
  public addVisitedView(view: any) {
    this.ADD_VISITED_VIEW(view)
  }

  @Action
  public delView(view: any) {
    this.DEL_VISITED_VIEW(view)
  }

  @Action
  public delOthersViews(view: any) {
    this.DEL_OTHERS_VISITED_VIEWS(view)
  }

  @Action
  public delAllViews() {
    this.DEL_ALL_VISITED_VIEWS()
  }

  @Action
  public updateVisitedView(view: any) {
    this.UPDATE_VISITED_VIEW(view)
  }
}

export const tagsViewStore = getModule(TagsView)
