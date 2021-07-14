<?php

namespace backend\controllers;

use common\models\Menus;
use common\models\MenusDays;
use common\models\MenusDishes;
use common\models\MenusNutrition;
use common\models\MenusSend;
use common\models\Municipality;
use common\models\Organization;
use common\models\SignupForm;
use Yii;
use common\models\NutritionApplications;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * NutritionApplicationsController implements the CRUD actions for NutritionApplications model.
 */
class NutritionApplicationsController extends Controller
{
    /**
     * {@inheritdoc}
     */

    public function actionIndex()
    {
        $model = new NutritionApplications();
        $model2 = new SignupForm();
        $dataProvider = new ActiveDataProvider([
            'query' => NutritionApplications::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'type_org_id' => 3])->orWhere(['reciever_org_id' => Yii::$app->user->identity->organization_id, 'type_org_id' => 3]),
        ]);
        $check = NutritionApplications::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'reciever_org_id' => Yii::$app->request->post()['SignupForm']['type_org']])->orWhere(['reciever_org_id' => Yii::$app->user->identity->organization_id, 'sender_org_id' => Yii::$app->request->post()['SignupForm']['type_org']])->count();
        if($check > 0){
            Yii::$app->session->setFlash('error', "Заявка уже была когда-то отправлена этой организации, либо указанная организация уже отправила заявку Вам. Повторная заявка не отправлена");
            return $this->redirect(['index']);
        }
        if (Yii::$app->request->post())
        {
            $model->type_org_id = 3;
            $model->status = 0;
            $model->sender_org_id = Yii::$app->user->identity->organization_id;
            $model->reciever_org_id = Yii::$app->request->post()['SignupForm']['type_org'];
            $model->save();
            Yii::$app->session->setFlash('success', "Заявка отправлена. Наблюдайте за статусом заявки, чтобы узнать одобрена она или отклонена");
            return $this->redirect(['index']);
        }


        return $this->render('index', [
            'dataProvider' => $dataProvider,
            'model' => $model,
            'model2' => $model2
        ]);
    }

    public function actionReceiving()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => NutritionApplications::find()->where(['reciever_org_id' => Yii::$app->user->identity->organization_id]),
            'pagination' => [
                'pageSize' => 100,
            ],
        ]);

        return $this->render('receiving', [
            'dataProvider' => $dataProvider,
        ]);
    }

    public function actionSendMenu()
    {
        $model = new NutritionApplications();
        $model2 = new MenusSend();

        $dataProvider = new ActiveDataProvider([
            'query' => MenusSend::find()->where(['reciever_org_id' => Yii::$app->user->identity->organization_id, 'reciever_type_org' => 3]),
            'pagination' => [
                'pageSize' => 100
            ],
        ]);


        return $this->render('send-menu', [
            'dataProvider' => $dataProvider,
            'model' => $model,
            'model2' => $model2,
        ]);
    }


    public function actionSendMenuBtn($menu_id, $organization_id)
    {
        $model = new NutritionApplications();
        $model2 = new Menus();
        $ids = [];
        $my_send_menus = MenusSend::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'reciever_type_org' => 3])->all();
        foreach ($my_send_menus as $s_menu){
            $ids[] = $s_menu->reciever_menu_id;
        }

            $post = Yii::$app->request->post()['NutritionApplications'];
            $this_menu = Menus::findOne($menu_id);
            $check = MenusSend::find()->where(['reciever_org_id' => $organization_id, 'sender_menu_id' => $menu_id])->one();
            if(!empty($check)){
                Yii::$app->session->setFlash('error', "Вы уже отправляли это меню в организацию");
                return $this->redirect(['send-menu']);
            }

            //print_r(Yii::$app->request->post()['NutritionApplications']);exit();
            $model2->organization_id = $organization_id;
            $model2->parent_id = Yii::$app->user->identity->organization_id;
            $model2->food_director = 0;
            $model2->show_indicator = 1;
            $model2->feeders_characters_id = $this_menu->feeders_characters_id;
            $model2->age_info_id = $this_menu->age_info_id;
            $model2->name = $this_menu->name;
            $model2->cycle = $this_menu->cycle;
            $model2->date_start = $this_menu->date_start;
            $model2->date_end = $this_menu->date_end;
            $model2->status_archive = 0;
            if($model2->save()){
                $menus_send = new MenusSend();
                $menus_send->sender_org_id = Yii::$app->user->identity->organization_id;
                $menus_send->reciever_org_id = $organization_id;
                $menus_send->reciever_type_org = 3;
                $menus_send->sender_menu_id = $this_menu->id;
                $menus_send->reciever_menu_id = $model2->id;
                $menus_send->save();
                $days = MenusDays::find()->where(['menu_id' => $menu_id])->all();
                $nutritions = MenusNutrition::find()->where(['menu_id' => $menu_id])->all();
                $menus_dishes = MenusDishes::find()->where(['menu_id' => $menu_id, 'date_fact_menu' => 0])->all();
                /*print_r($menus_dishes);
                exit;*/

                foreach($days as $day){
                    $model3 = new MenusDays();
                    $model3->menu_id = $model2->id;
                    $model3->days_id = $day->days_id;
                    $model3->save(false);
                }

                foreach ($nutritions as $nutrition){
                    $model4 = new MenusNutrition();
                    $model4->menu_id = $model2->id;
                    $model4->nutrition_id = $nutrition->nutrition_id;
                    $model4->save(false);
                }

                foreach ($menus_dishes as $m_dish){
                    $model5 = new MenusDishes();
                    $model5->date_fact_menu = 0;
                    $model5->menu_id = $model2->id;
                    $model5->cycle = $m_dish->cycle;
                    $model5->days_id = $m_dish->days_id;
                    $model5->nutrition_id = $m_dish->nutrition_id;
                    $model5->dishes_id = $m_dish->dishes_id;
                    $model5->yield = $m_dish->yield;
                    $model5->save();
                }
                Yii::$app->session->setFlash('success', "Меню успешно отправлено в организацию.");
                return $this->redirect(['send-menu']);
            }
            else{
                Yii::$app->session->setFlash('error', "Произошла ошибка при отправки меню снова");
                return $this->redirect(['send-menu']);
            }


    }

    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new NutritionApplications model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */

    public function actionDelete($menu_id, $organization_id)
    {
        $menus_send = MenusSend::find()->where(['reciever_org_id' => $organization_id, 'sender_menu_id' => $menu_id])->one();

        $old_menus_days = MenusDays::deleteAll('menu_id =:id', [':id' => $menus_send->reciever_menu_id]);

        $old_menus_nutrition = MenusNutrition::deleteAll('menu_id =:id', [':id' => $menus_send->reciever_menu_id]);

        $old_menus_dishes = MenusDishes::deleteAll('menu_id =:id', [':id' => $menus_send->reciever_menu_id]);

        $old_menus_dishes = Menus::find()->where(['id' => $menus_send->reciever_menu_id])->one()->delete();

        $menus_send->delete();

        Yii::$app->session->setFlash('success', "Меню успешно удалено.");
        return $this->redirect(['send-menu']);
    }

    /**
     * Finds the NutritionApplications model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return NutritionApplications the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = NutritionApplications::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }


    public function actionOrganizations()
    {
        $model = new Organization();
        //Если Вы представитель питания
        if(Organization::findOne(Yii::$app->user->identity->organization_id)->type_org == 4){
            $dataProvider = new ActiveDataProvider([
                'query' => Organization::find()->where(['type_org' => 3, 'region_id' => Organization::findOne(Yii::$app->user->identity->organization_id)->region_id]),
            ]);

        }
        //Если Вы представитель школы
        if(Organization::findOne(Yii::$app->user->identity->organization_id)->type_org == 3){
            $dataProvider = new ActiveDataProvider([
                'query' => Organization::find()->where(['type_org' => 4, 'region_id' => Organization::findOne(Yii::$app->user->identity->organization_id)->region_id]),
            ]);
        }

            return $this->render('organizations', [
                'dataProvider' => $dataProvider,
                'model' => $model,
            ]);
    }




    public function actionAccept($id)
    {
        $user = NutritionApplications::findOne($id);
        $user->status = 1;//prinyztie заявки
        if ($user->save())
        {
            Yii::$app->session->setFlash('success', "Заявка принята");
            return $this->redirect(Yii::$app->request->referrer);
        }
    }

    public function actionReject($id)
    {
        $user = NutritionApplications::findOne($id);
        $user->status = 2;//отклонение заявки
        if ($user->save())
        {
            Yii::$app->session->setFlash('success', "Заявка отклонена");
            return $this->redirect(Yii::$app->request->referrer);
        }
    }



    public function actionSendMenuFoodDirector()
    {
        $model = new NutritionApplications();
        $model2 = new Menus();
        $ids = [];
        $my_send_menus = MenusSend::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'reciever_type_org' => 4])->all();
        foreach ($my_send_menus as $s_menu){
            $ids[] = $s_menu->reciever_menu_id;
        }

            $dataProvider = new ActiveDataProvider([
                'query' => Menus::find()->where(['id' => $ids]),
                'pagination' => [
                    'pageSize' => 100,
                ],
            ]);
        if (Yii::$app->request->post())
        {
            $post = Yii::$app->request->post()['NutritionApplications'];
            $this_menu = Menus::findOne($post['reciever_org_id']);
            //print_r(Yii::$app->request->post()['NutritionApplications']);exit();
            $model2->organization_id = $post['sender_org_id'];
            $model2->parent_id = Yii::$app->user->identity->organization_id;
            $model2->food_director = 0;
            $model2->show_indicator = 1;
            $model2->feeders_characters_id = $this_menu->feeders_characters_id;
            $model2->age_info_id = $this_menu->age_info_id;
            $model2->name = $this_menu->name;
            $model2->cycle = $this_menu->cycle;
            $model2->date_start = $this_menu->date_start;
            $model2->date_end = $this_menu->date_end;
            $model2->status_archive = 0;
            if($model2->save()){
                $menus_send = new MenusSend();
                $menus_send->sender_org_id = Yii::$app->user->identity->organization_id;
                $menus_send->reciever_org_id = $post['sender_org_id'];
                $menus_send->reciever_type_org = 4;
                $menus_send->sender_menu_id = $this_menu->id;
                $menus_send->reciever_menu_id = $model2->id;
                $menus_send->save();
                $days = MenusDays::find()->where(['menu_id' => $post['reciever_org_id']])->all();
                $nutritions = MenusNutrition::find()->where(['menu_id' => $post['reciever_org_id']])->all();
                $menus_dishes = MenusDishes::find()->where(['menu_id' => $post['reciever_org_id'], 'date_fact_menu' => 0])->all();
                /*print_r($menus_dishes);
                exit;*/

                foreach($days as $day){
                    $model3 = new MenusDays();
                    $model3->menu_id = $model2->id;
                    $model3->days_id = $day->days_id;
                    $model3->save(false);
                }

                foreach ($nutritions as $nutrition){
                    $model4 = new MenusNutrition();
                    $model4->menu_id = $model2->id;
                    $model4->nutrition_id = $nutrition->nutrition_id;
                    $model4->save(false);
                }

                foreach ($menus_dishes as $m_dish){
                    $model5 = new MenusDishes();
                    $model5->date_fact_menu = 0;
                    $model5->menu_id = $model2->id;
                    $model5->cycle = $m_dish->cycle;
                    $model5->days_id = $m_dish->days_id;
                    $model5->nutrition_id = $m_dish->nutrition_id;
                    $model5->dishes_id = $m_dish->dishes_id;
                    $model5->yield = $m_dish->yield;
                    $model5->save();
                }
                Yii::$app->session->setFlash('success', "Меню успешно отправлено в организацию.");
                return $this->redirect(['send-menu-food-director']);
            }
            else{
                Yii::$app->session->setFlash('error', "Произошла ошибка при отправки меню снова");
                return $this->redirect(['send-menu-food-director']);
            }
        }


        return $this->render('send-menu-food-director', [
            'dataProvider' => $dataProvider,
            'model' => $model,
            'model2' => $model2,
        ]);
    }

    public function actionRequestFood()
    {
        $model = new NutritionApplications();
        $model2 = new SignupForm();
        $dataProvider = new ActiveDataProvider([
            'query' => NutritionApplications::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'type_org_id' => 4])->orWhere(['reciever_org_id' => Yii::$app->user->identity->organization_id, 'type_org_id' => 4]),
        ]);
        $check = NutritionApplications::find()->where(['sender_org_id' => Yii::$app->user->identity->organization_id, 'reciever_org_id' => Yii::$app->request->post()['SignupForm']['type_org'], 'type_org_id' => 4])->orWhere(['reciever_org_id' => Yii::$app->user->identity->organization_id, 'sender_org_id' => Yii::$app->request->post()['SignupForm']['type_org'], 'type_org_id' => 4])->count();
        if($check > 0){
            Yii::$app->session->setFlash('error', "Заявка уже была когда-то отправлена этой организации, либо указанная организация уже отправила заявку Вам. Повторная заявка не отправлена");
            return $this->redirect(['index']);
        }
        if (Yii::$app->request->post())
        {
            $model->type_org_id = 4;
            $model->status = 0;
            $model->sender_org_id = Yii::$app->user->identity->organization_id;
            $model->reciever_org_id = Yii::$app->request->post()['SignupForm']['type_org'];
            $model->save();
            Yii::$app->session->setFlash('success', "Заявка отправлена. Наблюдайте за статусом заявки, чтобы узнать одобрена она или отклонена");
            return $this->redirect(['request-food']);
        }


        return $this->render('request-food', [
            'dataProvider' => $dataProvider,
            'model' => $model,
            'model2' => $model2
        ]);
    }





    public function actionKazanReg()
    {
        $count = 0;
        $organizations = Organization::find()->where(['type_org' => 3, 'municipality_id' => 2217])->all();
        //print_r($organizations);exit;
        foreach ($organizations as $organization)
        {
            if ($organization->id != 12939 && $organization->id != 12988 && $organization->id != 13096 && $organization->id != 13113)
            {
                $model = new  NutritionApplications();
                $model->type_org_id = 3;
                $model->status = 1;
                $model->sender_org_id = $organization->id;
                $model->reciever_org_id = 12971;
                $model->save();
                $count++;
            }
        }
            Yii::$app->session->setFlash('success', $count);
            return $this->redirect(['index']);

    }

}
